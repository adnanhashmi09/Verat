const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    soul: {
        type: String,
        unique: true,
        required: true
    },
    refCode: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    title: {
        type: String
    },
    review: {
        type: Boolean,
        default: false
    },
    permissions: {
        viewUsers: {
            type: Boolean,
            default: true,
            required: true
        },
        approveUsers: {
            type: Boolean,
            default: true,
            required: true
        },
        deleteUsers: {
            type: Boolean,
            default: true,
            required: true
        },
        manageOrders: {
            type: Boolean,
            default: true,
            required: true
        },
        viewOrders: {
            type: Boolean,
            default: true,
            required: true
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
