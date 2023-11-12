const jwt = require('jsonwebtoken');
const ErrorResponse = require("../utils/errorResponse");

exports.protect = (req, res, next) => {
    const { authorization } = req.headers;

    let token;

    // token from header
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }

    // token from cookie
    // else if (req.cookies.token) {
    //  token = req.cookies.token;
    // }

    if (!token) {
        return next(new ErrorResponse("No Authorization", 401));
    }

    try {
        const decode = jwt.verify(token, process.env.SALT);
        req.username = decode.username;
        req.password = decode.password;
        req.level = decode.level;

        next();
    } catch (error) {
        console.error(error);
        return next(new ErrorResponse("Not Authorized to access this route", 401));
    }
};