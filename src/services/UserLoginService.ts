import * as express from 'express';
import * as _ from 'lodash';
import * as Debug from 'debug';
import { IRequest } from '../interfaces/IRequest';
import { userLoginModel } from '../models/UserLoginModel';
import * as Boom from '@hapi/boom';
import * as crypt from 'crypto';

const debug = Debug('DC:UserLoginService');

/**
 * Search user login details by userId
 * @param: userId
 */
export const searchOneByUserId: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const params = _.merge(req.params, req.body);
    if (_.isEmpty(params.userId)) {
        return next();
    }
    try {
        const whereCondition: any = {
            userId: params.userId
        };
        req.userLoginStore = await userLoginModel.find(whereCondition);
    } catch (error) {
        debug('error ', error);
        return next(error);
    }
    return next();
};

export const insert: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    if (_.isEmpty(req.userStore)) {
        return next(Boom.notFound('User does not exists.'));
    }
    let loginToken = '';
    try {
        loginToken = new Date().toUTCString();
    } catch (exception) {
        debug('Exception %o ', exception);
        return next(Boom.notFound(exception));
    }
    const hash = crypt.createHash('sha256');
    hash.update(loginToken);

    // debug('ip-address', req.headers['x-forwarded-for']);
    const data: any = {
        firstName: req.userStore.firstName,
        lastName: req.userStore.lastName,
        email: req.userStore.email,
        userId: req.userStore.id,
        loginTime: new Date(),
        token: hash.digest('base64'),
        timestamp: new Date()
    };
    try {
        req.userLoginStore = await userLoginModel.create(data);
    } catch (error) {
        debug('error: %o', error);
        return next(error);
    }
    return next();
};

export const searchAll: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    try {
        req.userLoginItemsStore = await userLoginModel.find();
    } catch (error) {
        debug('error ', error);
        return next(error);
    }
    return next();
};
