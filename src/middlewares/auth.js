// Import dependencies
const { User }  = require("../models/user");
const jwt = require("../services/jwt");
const AppError = require("../errors/appError");

exports.auth = async (req, res, next) => {
    const token = req.cookies.auth;
    if (!token) next(new AppError("Token Not Found!", 404));

    const user = await User.findOne({ token });
    if (!user) next(new AppError("User Not Logged In!", 400));

    const decoded = jwt.decode(token);
    if (!decoded) next(new AppError("User Authorization Failed", 403));

    req.USER_ID = user._id;
    next();
}