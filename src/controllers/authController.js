// Import dependencies
const { validationResult } = require("express-validator");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');
const { User } = require("../models/user");
const jwt = require("../services/jwt");
const bcrypt = require("../services/bcrypt");

const userAuth = {};


// User Sign Up
userAuth.signup = catchAsync(async (req, res, next) => {
    const { fullName, userName, email, password} = req.body;
    
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        if (errors.array()[0].param === 'email') return next(new AppError("Invalid Email!", 400));
        else return next(new AppError("Password Must Be At Least 6 Characters And Must Contain A Number", 400));
    }

    const userExist = await User.exists({ email });
    if (userExist) return next(new AppError("User With Email Already Exists!", 400));

    // hash passwords
    const passwordHash = await bcrypt.hash(password)

    // save user
    const user = await new User({ fullName, userName, email, password: passwordHash }).save();

    if (!user) return next( new AppError("Could Not Creat User!", 403));
    
    // send response
    res.status(200).send({
        message: "User Created Successfully!"
    });
})

// Login
userAuth.login = catchAsync(async (req, res, next) => {
    // get email and password from form
    const { nameField, password } = req.body;

    // if email/username or password is absent return error
    if (!nameField || !password) return next(new AppError("Please Provide Email/UserName And Password!", 400));

    // find user with email or username
    let user = await User.findOne({ email: nameField }) || await User.findOne({ userName: nameField });
    if (!user) return next(new AppError("Invalid Email/UserName Or Password!", 400));

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return next(new AppError("Invalid Email/UserName Or Password!", 400));

    const accessToken = jwt.sign(user.userName);
    user.token = accessToken;
    user = await user.save();

    //send response
    res.status(200).send({
        message: `Hello ${user.userName}! Welcome To Our Feedback API`,
        data : { userId: user._id, accessToken, fullName: user.fullName, userName: user.userName }
    });
});

// Logout
userAuth.logout = catchAsync(async (req, res, next) => {
    // get user
    let user = await User.findById({ _id: req.USER_ID });
    if (!user) return next(new AppError("User Not Found! Something Went Wrong!", 400))
    user.token = '';
    user = await user.save();
    res.sendStatus(200);
});

module.exports = userAuth;