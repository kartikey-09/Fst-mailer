const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new mongoose.Schema({
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
    name: {
        type: String,
        required: true,
    },
    groupName: {
        type: String,
        default: "",
    },
    phone:{
        type: Number,
        required: true,
    }
}, { timestamps: true });

mongoose.models = {};
contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('contacts', contactSchema);

module.exports = Contact;
