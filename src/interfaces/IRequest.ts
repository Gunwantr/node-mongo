import {Request} from 'express';

export interface IRequest extends Request {
    data: any;
    userStore: any;
    userItemStore: any;
    userLoginStore: any;
    userLoginItemsStore: any;
}
