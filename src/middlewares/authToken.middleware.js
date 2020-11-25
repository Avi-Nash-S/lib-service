const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader;
    if(!token) return res.status(401).json({ message: 'Access Denied'});
    const jwtValidation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!jwtValidation) return res.status(403).json({ message: 'Invalid Token'});
    req.user = jwtValidation;
    next();
};

module.exports.authenticateToken = authenticateToken;