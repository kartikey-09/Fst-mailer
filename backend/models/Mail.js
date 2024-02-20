const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    receivers: {
        type: [String],
        required: [true, "Receiver is required"],
        select:false
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

const Mail = mongoose.model('mails', schema);
module.exports = Mail;