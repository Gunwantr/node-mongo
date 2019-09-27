import * as express from 'express';
import * as passport from 'passport';
import * as userController from '../../controllers/UserController';
import * as userService from '../../services/UserService';
import * as userLoginService from '../../services/UserLoginService';

const userRoute: express.Router = express.Router();
/**
 * User register
 */
userRoute.post('/register', [
    userService.validateRegisterParameter,
    userService.searchOneByEmail,
    userService.insert,
    userController.userDetail
]);

/**
 * User login
 */
userRoute.put('/login', [
    userService.validateUserData,
    userService.searchOneByEmail,
    userService.compareUserPassword,
    // userService.createToken,
    userLoginService.insert,
    userController.userLoginDetail
]);

/**
 * Get current login user
 */
userRoute.get('/me', passport.authenticate('bearer'), [
    userController.me

]);

/**
 * Get users
 */
userRoute.get('/', passport.authenticate('bearer'), [
    userService.searchAll,
    userController.users
]);

export { userRoute };
