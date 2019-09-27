import * as Debug from 'debug';
import * as _ from 'lodash';
import * as Boom from '@hapi/boom';
import * as moment from 'moment';
import * as passportHttpBearer from 'passport-http-bearer';
import { IRequest } from '../../interfaces/IRequest';
import { userLoginModel } from '../../models/UserLoginModel';

const debug = Debug('DC:passport');
const bearerStrategy = passportHttpBearer.Strategy;

export const passport = new bearerStrategy({
    scope: '',
    realm: '',
    passReqToCallback: true
}, async (req: IRequest, token: string, callback: any) => {

    let userLoginDocument: any;
    try {
        userLoginDocument = await userLoginModel.findOne({token: token}).populate('userId');
    } catch (error) {
        debug('Error %o ', error);
        return callback(error);
    }
    if (_.isEmpty(userLoginDocument)) {
        return callback(new Boom('You are unauthorised User.', {statusCode: 401}));
    }
    const expiryTimestamp: any = moment(userLoginDocument.timestamp).add(1, 'hour');
    const isAfter: boolean = moment(expiryTimestamp).isAfter(moment().format());

    if (isAfter === false) {
        return callback(new Boom('Your session has been expired.', {statusCode: 401}));
    }
    const {userId, token: userToken, timestamp} = userLoginDocument;
    req.userStore = {...userId, token: userToken, timestamp};
    const user = req.userStore && req.userStore._doc ? req.userStore._doc : req.userStore;
    return callback(undefined, user);

});
