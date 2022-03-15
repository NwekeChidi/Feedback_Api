const { Post } = require("../models/post");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../errors/appError");

const userController = {};

// create post
userController.createPost = catchAsync( async ( req, res, next ) => {
    let { title, feedback, postTag } = req.body;
    postTag = postTag.toLowerCase();

    if (!feedback || !postTag ) return next(new AppError("Cannot Post Empty Feedback Or Tag", 401));

    const newPost = await new Post({title, feedback, author: req.USER_ID, postTag}).save();
    if (!newPost) return next(new AppError("Could Not Create Post", 400));

    res.status(200).json({ message: "Post Created Successfully!" });
})

module.exports = userController;