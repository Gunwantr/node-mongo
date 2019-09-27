import * as express from 'express';
import * as Boom from '@hapi/boom';
import * as crypt from 'crypto';
import * as _ from 'lodash';
import * as Debug from 'debug';
import * as utils from '../utils/index';
import { IRequest } from '../interfaces/IRequest';
import { userModel } from '../models/UserModel';

const debug = Debug('DC:UserService');

export const validateRegisterParameter: express.RequestHandler = (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const params: any = _.merge(req.params, req.body);
    if (_.isEmpty(params.firstName)) {
        return next(Boom.notFound('Please enter firstName'));
    } else if (_.isEmpty(params.lastName)) {
        return next(Boom.notFound('Please enter lastName'));
    } else if (_.isEmpty(params.email)) {
        return next(Boom.notFound('Please enter email'));
    } else if (_.isEmpty(params.mobile)) {
        return next(Boom.notFound('Please enter mobile'));
    } else if (_.isEmpty(params.password)) {
        return next(Boom.notFound('Please enter password'));
    }
    return next();
};

/**
 * Validate user login parameter
 */
export const validateUserData: express.RequestHandler = (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const params = _.merge(req.params, req.body);
    if (_.isEmpty(params.email)) {
        return next(Boom.notFound('Please enter email address.'));
    } else if (_.isEmpty(params.password)) {
        return next(Boom.notFound('Please enter password.'));
    }
    return next();
};

/**
 * Search user by email
 * @param: email
 */
export const searchOneByEmail: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const params = _.merge(req.params, req.body);
    if (_.isEmpty(params.email)) {
        return next();
    }
    try {
        const whereCondition: any = {
            email: params.email
        };
        req.userStore = await userModel.findOne(whereCondition);
    } catch (error) {
        debug('error ', error);
        return next(error);
    }
    return next();
};

export const insert: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const params: any = _.merge(req.params, req.body);
    if (!_.isEmpty(req.userStore)) {
        return next();
    }
    const data: any = {
        firstName: params.firstName,
        lastName: params.lastName,
        fullName: `${ params.firstName || '' } ${ params.lastName || '' }`,
        email: params.email,
        password: utils.encryptSync(params.password)
    };
    try {
        req.userStore = await userModel.create(data);
    } catch (error) {
        debug('error: %o', error);
        return next(error);
    }
    return next();
};

export const updateEmployeePassword: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const params: any = _.merge(req.params, req.body);
    if (_.isEmpty(req.userStore)) {
        return next();
    }
    const data: any = {
        firstName: params.firstName,
        lastName: params.lastName,
        fullName: `${ params.firstName || '' } ${ params.lastName || '' }`,
        email: params.email,
        password: utils.encryptSync(params.password)
    };
    try {
        req.userStore = await userModel.update({ email: params.email }, data, { new: true });
    } catch (error) {
        debug('error: %o', error);
        return next(error);
    }
    return next();
};

/**
 * Compare User Password with Database
 */
export const compareUserPassword: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const params = _.merge(req.params, req.body);
    if (_.isEmpty(req.userStore)) {
        return next(Boom.notFound('User does not exists.'));
    }
    try {
        const isValid = await utils.comparePassword(params.password, req.userStore.password);
        if (isValid === false) {
            return next(Boom.notFound('You have entered invalid authentication.'));
        }
    } catch (error) {
        debug('error ', error);
        return next(error);
    }
    return next();
};

export const createToken: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
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

    const token: any = {};
    token.token = hash.digest('base64');
    token.timestamp = new Date();
    try {
        req.userStore = await userModel.findOneAndUpdate(req.userStore.id, token, { new: true });
    } catch (error) {
        debug('error ', error);
        return next(error);
    }
    return next();
};

/**
 * Search all user
 */
export const searchAll: express.RequestHandler = async (req: IRequest, res: express.Response, next: express.NextFunction) => {
    try {
        req.userItemStore = await userModel.find();
    } catch (error) {
        debug('error ', error);
        return next(error);
    }
    return next();
};
