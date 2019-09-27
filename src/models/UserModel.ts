import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const userModel = mongoose.model('users', new Schema({
    firstName: {type: String},
    lastName: {type: String},
    fullName: {type: String},
    email: {type: String},
    isEmailVerified: {type: Boolean, default: false},
    mobile: {type: String},
    isMobileVerified: {type: Boolean, default: false},
    password: {type: String},
    employeeId: {type: String},
    designation: {type: String}
}, {
    timestamps: true
}));
