const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    teamName: {
        type: String,
        default: "",
    }
}, { timestamps: true });

mongoose.models = {};

const User = mongoose.model('users', schema)

module.exports = User;