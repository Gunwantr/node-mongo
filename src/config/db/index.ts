import * as mongoose from 'mongoose';
import * as Debug from 'debug';
import { DB } from '../../constants/AppConstants';

const debug = Debug('DC:index.ts');

mongoose.connect(DB.URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, (error: mongoose.Error) => {
    if (error) {
        debug('Database connection: error: %o', error);
    }
    debug('Database connected successfully: %o', DB.URL);
});
