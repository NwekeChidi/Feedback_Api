// Import dependencies
const { validationResult } = require("express-validator");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const userAuth = {};


// User Sign Up
userAuth.signup = catchAsync(async (req, res, next) => {
    const { fullName, userName, email, password} = req.body;

    
    const errors = validationResult(req);
    console.log(errors.array())

    if (!errors.isEmpty()){
        if (errors.array()[0].param === 'email') return next(new AppError("Invalid Email!", 400));
        else return next(new AppError("Password Must Be At Least 6 Characters And Must Contain A Number", 400));
    }

    const userExist = await User.exists({ email });
    if (userExist) return next(new AppError("User With Email Already Exists!", 400));
    if (await User.exists({ userName })) return next(new AppError("Username Already Exists! Pick A New One!"))


    // hash passwords
    const salt = 15;
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await new User({
        fullName,
        userName,
        email,
        password: passwordHash
    }).save();

    // create token
    const token = jwt.sign(
        { user_id: user._id },
        JWT_SECRET,
        { expiresIn: 60 * 10 }
    );

    if (!user) {
        next( new AppError("Could Not Creat User!", 403))
    }
    res.status(200).send({
        message: "User Created Successfully!",
        data: {
            token,
            userName,
            email
        }
    })
})

module.exports = userAuth;