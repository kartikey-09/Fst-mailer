const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        return ({ success: true, message: "Token verified.", user:decoded });

    } catch (err) {
        return ({ success: false, message: "Invalid token" });
    }
}

module.exports = verifyToken;