import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const userLoginModel = mongoose.model('userlogins', new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    loginTime: {type: Date},
    token: {type: String},
    timestamp: {type: Date}
}, {
    timestamps: true
}));
