import * as Debug from 'debug';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { IRequest } from '../interfaces/IRequest';

const debug = Debug('DC:Utils');

let baseUrl: string = '';

export const encryptSync = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const comparePassword = (password: string, encryptedPassword: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, encryptedPassword, (error: any, isPasswordMatch: boolean) => {
            if (error) {
                debug('error %o', error);
                return reject(error);
            }
            return resolve(isPasswordMatch);
        });
    });
};

export const url = (req: IRequest) => {
    return req.protocol + '://' + req.get('host');
};

export const setBaseUrl = (req: IRequest) => {
    baseUrl = this.url(req);
};

export const getBaseUrl = () => {
    return baseUrl;
};

export const emailValidation = (email: string) => {
    if (_.isEmpty(email)) {
        return false;
    }
    const atpos = email.indexOf('@');
    const dotpos = email.lastIndexOf('.');
    if (atpos < 1) {
        return false;
    } else if (dotpos < (atpos + 2)) {
        return false;
    } else if ((dotpos + 2 >= email.length)) {
        return false;
    }
    return true;
};

