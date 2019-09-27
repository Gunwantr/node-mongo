import * as express from 'express';
import * as _ from 'lodash';
import * as Boom from '@hapi/boom';
import { IRequest } from '../interfaces/IRequest';

/**
 * Get user register details
 */
export const userDetail: express.RequestHandler = (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const userStore = req.userStore;
    if (_.isEmpty(userStore)) {
        return next(Boom.notFound('Please try again'));
    }
    req.data = userStore;
    return next();
};

/**
 * Create user login details
 */
export const userLoginDetail: express.RequestHandler = (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const userStore = req.userStore;
  const user = userStore && userStore._doc ? userStore._doc : userStore;
    req.data = {...user};
    return next();
};

/**
 * Get user details
 */
export const me: express.RequestHandler = (req: IRequest, res: express.Response, next: express.NextFunction) => {
    const userStore = req.user;
    if (_.isEmpty(userStore)) {
        return next(Boom.notFound('Session has been expired'));
    }
    req.data = userStore;
    return next();
};

/**
 * Get users
 */
export const users: express.RequestHandler = (req: IRequest, res: express.Response, next: express.NextFunction) => {
    req.data = req.userItemStore;
    return next();
};
