import * as Debug from 'debug';

const debug = Debug('DC:AppConstant');
export const DB = {
    URL: process.env.DB_URL
};

export const APP = {
    UI_ENDPOINT: process.env.UI_ENDPOINT
};

if (!DB.URL) {
    debug('!--------------------------------------------------------!');
    debug('! Please export database url');
    debug('!--------------------------------------------------------!');
    process.exit(0);
}