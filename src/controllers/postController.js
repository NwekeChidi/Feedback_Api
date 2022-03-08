const { Post } = require("../models/post");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../errors/appError");

const userController = {};

// create post
userController.createPost = catchAsync( async ( req, res, next ) => {
    const { feedback } = req.body;
    if (!feedback) return next(new AppError("Cannot Post Empty Feedback", 401));

    const newPost = await new Post({feedback, author: req.USER_ID}).save();
    if (!newPost) return next(new AppError("Could Not Create Post", 400));

    res.status(200).send({ message: "Post Created Successfully!", post: newPost });
})

module.exports = userController;