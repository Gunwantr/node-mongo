import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import './config/db/index';
import { router } from './routes/v1';
import * as AppConfig from './config/AppConfig';
import * as Debug from 'debug';
import * as passportConfig from './config/passport';
import * as passport from 'passport';
import * as cors from 'cors';

const debug = Debug('DC:server');
const app = express();

app.use(cors({origin: '*'}));
app.use(session({
    secret: 'THIS_IS_SECRET',
    cookie: {
        maxAge: 1000000
    },
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(passport.initialize());

passport.use(passportConfig.passport);

passport.serializeUser((user: any, callback: any) => {
    return callback(undefined, user);
});

passport.deserializeUser((user: any, callback: any) => {
    return callback(undefined, user);
});
// App Configs
app.use(AppConfig.trimParams);

app.get('/', (request: express.Request, response: express.Response) => {
    response.json({message: 'REST API is working !'});
});

app.set('port', process.env.PORT || 3004);
app.listen(app.get('port'), () => {
    debug('Express server listening on port %o ', app.get('port'));
});

// This is our route middleware
app.use('/api/v1', router);

// Error handling
app.use(AppConfig.handleError);

// Handle response
app.use(AppConfig.handleSuccess);

// Handle response
app.use(AppConfig.handle404);

// Catch uncaught exceptions
process.on('uncaughtException', (error: any) => {
    // handle the error safely
    return error;
});

export { app };
