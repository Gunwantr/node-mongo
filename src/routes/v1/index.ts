import * as express from 'express';
import {userRoute} from './UserRoute';

const router: express.Router = express.Router();
/**
 * User routes
 */
router.use('/user', userRoute);
export {router};
