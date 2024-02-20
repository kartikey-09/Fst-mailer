const mongoose = require('mongoose')

const EmailTracking = mongoose.model('EmailTracking', {
    emailId: String,
    openedAt: { type: Date, default: Date.now },
  });

module.exports = EmailTracking;