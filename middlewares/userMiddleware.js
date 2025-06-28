const jwt = require("jsonwebtoken");
const {JWT_USER} = require("../config");

function authenticateUser(req , res , next){
    const token  = req.headers.token;
    
    if (!token) {
        return res.status(401).json({
            message : "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token , JWT_USER);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(403).json({
            message : "Invalid token"
        });
    }
}

function userMiddleware(req , res , next){
    const token  = req.headers.token;
    const decoded = jwt.verify(token , JWT_USER)

    if(decoded){
        req.userId = decoded.id
        next()
    }else{
        return res.status(403).json({
            message : "You are not signed in"
        })
    }
}

module.exports = {
    userMiddleware : userMiddleware,
    authenticateUser: authenticateUser
}