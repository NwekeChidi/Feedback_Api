const { Post } = require("../models/post");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../errors/appError");

const postController = {};

// create post
postController.createPost = catchAsync( async ( req, res, next ) => {
    let { title, feedback, postTag } = req.body;
    postTag = postTag.toLowerCase();

    if (!feedback || !postTag ) return next(new AppError("Cannot Post Empty Feedback Or Tag", 401));

    const newPost = await new Post({title, feedback, author: req.USER_ID, postTag}).save();
    if (!newPost) return next(new AppError("Could Not Create Post", 400));

    res.status(200).json({ message: "Post Created Successfully!" });
})

// get all posts
postController.getAll = catchAsync( async (req, res, next ) => {
    const allPost = await Post.find({}).sort({created_at: 'desc'}).exec();
    if (!allPost) return next(new AppError("Could Not Fetch Posts!", 400));
    res.status(200).send({allPost});
})

// delete post
postController.deletePost = catchAsync( async (req, res, next ) => {
    const postId = req.params?.postId;
    const currPost = await Post.findById({ _id: postId });

    if (!currPost) return next(new AppError(`Post with id: ${postId} not found!`, 400));
    await currPost.remove();

    res.status(200).send({ message: "Post Deleted Successfully!"});
})
module.exports = postController;