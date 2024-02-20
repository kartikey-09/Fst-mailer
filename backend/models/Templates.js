const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    createrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    acceptedMailIds:{ // new changes
        type: [String],
        select:false
    },
    rejectedMailIds:{ // new changes
        type: [String],
        select:false
    }
}, { timestamps: true });

const Template = mongoose.model('templates', schema);
module.exports = Template;