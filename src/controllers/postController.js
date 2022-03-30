const { Post }   = require("../models/post");
const sorters    = require('../utils/sorters');
const AppError   = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");

const postController = {};

// create post
postController.createPost = catchAsync( async ( req, res, next ) => {
    let { title, feedback, postTag } = req.body;

    if (!feedback || !postTag ) return next(new AppError("Cannot Post Empty Feedback Or Tag", 401));

    const newPost = await new Post({ title, feedback, author: req.USER_ID, postTag }).save();
    if (!newPost) return next(new AppError("Could Not Create Post", 400));

    req.message = "Post Created Successfully!";
    next();
})

// get all posts
postController.getAll = catchAsync( async (req, res, next ) => {
    const sortBy = req.params?.sortBy, category = req.params?.filter;

    let sortedPosts; const sortfn = sorters.sortByFilter(sortBy);
    if (category === "all") {
        sortedPosts = await Post.find({});
        sortedPosts.sort(sortfn);
    } else {
        sortedPosts = await Post.aggregate([
            { $match: { postTag: category } }
        ]);
        sortedPosts.sort(sortfn);
    }
    if (!sortedPosts) return next(new AppError("Could Not Fetch Posts!", 400));
    const message = req.message || "Welcome!"
    res.status(200).send({ message, sortedPosts });
});

// delete post
postController.deletePost = catchAsync( async (req, res, next ) => {
    const postId = req.params?.postId;
    const currPost = await Post.findById({ _id: postId });

    if (!currPost) return next(new AppError(`Post with id: ${postId} not found!`, 400));
    await currPost.remove();

    res.status(200).send({ message: "Post Deleted Successfully!"});
})
module.exports = postController;