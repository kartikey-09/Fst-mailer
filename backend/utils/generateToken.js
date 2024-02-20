const jwt = require('jsonwebtoken')

// function to generate auth token
const generateToken = (_id, name, role, emailId) => {
    return jwt.sign({ _id, name, role, emailId }, process.env.JWT_SECRET)
}

module.exports = generateToken
