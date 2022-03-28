const { Comment } = require('../models/comment');
const AppError    = require('../errors/appError');
const catchAsync  = require('../utils/catchAsync');

const commentController = {}

// post a comment
commentController.postComment = catchAsync( async (req, res, next) =>{
    const { comment } = req.body, postId = req.params.postId;
    if (!comment || !postId) return next(new AppError("No Comment Or Post To Comment On!", 400));

    const data = {
        author: req.USER_ID,
        comment
    }
    
    // check if posts already has comments
    let currComment = await Comment.findOne({ postId });
    if (currComment){
        currComment.comments.push(data);
        await currComment.save();
    } else {
        currComment = new Comment({ postId });
        currComment.comments.push(data);
        await currComment.save();
    }
    if (!currComment) return next(new AppError("Could Not Comment On Post!", 403));

    res.status(200).send({
        status: "OK",
        currComment
    });
});

// reply a comment
commentController.replyComment = catchAsync( async (req, res, next) =>{
    const { comment } = req.body, commentId = req.params.commentId;
    if (!comment || !postId) return next(new AppError("No Comment Or Post To Comment On!", 400));

    const data = {
        author: req.USER_ID,
        comment
    }
    
    // check if posts already has comments
    const currPost = await Comment.findOne({ commentId });
    if (currPost){
        currPost.comments.id(commentId).subComments.push(data);
        await currPost.save();
    }
    if (!currPost) return next(new AppError("Could Not Comment On Post!", 403));

    res.status(200).send({
        status: "OK",
        currPost
    });
});

// Delete comment
commentController.deleteComment = catchAsync( async (req, res, next) => {
    const commentId = req.params?.commentId;
    const currComment = await Comment.findOne({ commentId });
    if (!currComment) return next( new AppError(`Comment with id: ${commentId}, not found!`));
    await currComment.remove();

    res.status(200).send({ message: "Comment Successfully Deleted!"});
})

module.exports = commentController;