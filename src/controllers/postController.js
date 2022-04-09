const { Post }   = require("../models/post");
const { User }   = require("../models/user");
const sorters    = require("../utils/sorters");
const { Comment } = require("../models/comment");
const AppError   = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("../utils/handlerFactory");

const postController = {};

// create post
postController.createPost = catchAsync( async ( req, res, next ) => {
    let { title, feedback, postTag } = req.body;

    if (!feedback || !postTag ) return next(new AppError("Cannot Post Empty Feedback Or Tag", 401));

    const newPost = await new Post({
        title, feedback, author: req.USER_ID, authorName: req.fullName,
        authorUserName: req.userName, postTag }).save();
    

    if (!newPost) return next(new AppError("Could Not Create Post", 400));

    res.status(200).send({
        message: "Post Created Successfully!"
    });
})

// get all posts
postController.getAll = catchAsync( async (req, res, next ) => {
    const sortBy = req.params?.sortBy, category = req.params?.filter;

    let sortedPosts; const sortfn = sorters.sortByFilter(sortBy);
    if (category === "all") {
        sortedPosts = await Post.find({});
        sortedPosts.sort(sorters.sortByFilter(sortBy));
    } else {
        sortedPosts = await Post.aggregate([
            { $match: { postTag: category } }
        ]);
        sortedPosts.sort(sortfn);
    }
    if (!sortedPosts) return next(new AppError("Could Not Fetch Posts!", 400));
    res.status(200).send({ status: "OK", sortedPosts });
});

// delete post
postController.deletePost = catchAsync( async (req, res, next ) => {
    const postId = req.params?.postId;
    const currPost = await Post.findById({ _id: postId });

    if (!currPost) return next(new AppError(`Post with id: ${postId} not found!`, 400));
    await currPost.remove();

    res.status(200).send({ message: "Post Deleted Successfully!"});
});

// upvote post
postController.upvote = catchAsync( async (req, res, next ) => {
    const postId = req.params.postId;
    const currPost = await Post.findById({ _id: postId });

    if (!currPost) return next(new AppError(`Post with id: ${postId} not found!`, 400));
    // check if user has upvoted post before
    let id = req.USER_ID;
    if ( currPost?.upvoters.includes(id) ){
        currPost.upvoters.splice(currPost.upvoters.indexOf(id), 1);
        currPost.upvotes -= 1;
    } else {
        currPost.upvoters.push(id);
        currPost.upvotes += 1;
    }
    currPost.save( (err, result) => {
        if (err) return next(new AppError("Could not upvote post", 400));
        else res.status(200).send({
            message: "Upvote Successful!"
        })
    });
});

// get one post
postController.getOnePost = catchAsync( async (req, res, next) => {
    const postId = req.params.postId;
    handlerFactory.getOne(Post, postId).populate({ path: "allComments" }).then(result => {
        if (!result) {
            return next(new AppError("Could Not Retrieve Post!", 400))}
        else res.status(200).send({
                message: "Post Retrieved Successfully!",
                result
            })
    });
})
module.exports = postController;