const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //get token from header
        const token = req.headers.authorization.split(" ")[1];// whemn I send token Bearer token this is why[1]
        // error if token is wrong
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Auth failed' });
    }
};