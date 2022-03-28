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
        comments: currComment.comments
    });
});

// reply a comment
commentController.replyComment = catchAsync( async (req, res, next) =>{
    const { comment } = req.body, commentId = req.params.commentId;
    if (!comment || !commentId) return next(new AppError("No Reply or comment to reply!", 400));

    const data = {
        author: req.USER_ID,
        comment
    }
    
    // check if posts already has comments
    const currComment = await Comment.findOne({ commentId });
    if (currComment){
        currComment.comments.id(commentId).subComments.push(data);
        await currComment.save();
    }
    if (!currComment) return next(new AppError("Could Not Comment On Post!", 403));

    res.status(200).send({
        status: "OK",
        comments: currComment.comments
    });
});

// Delete comment
commentController.deleteComment = catchAsync( async (req, res, next) => {
    const commentId = req.params?.commentId;
    const currComment = await Comment.findOne({ commentId });
    if (!currComment) return next( new AppError(`Comment with id: ${commentId}, not found!`));
    await currComment.comments.id(commentId).remove();
    currComment.markModified('comments');
    await currComment.save();

    res.status(200).send({ message: "Comment Successfully Deleted!"});
});

// Delete a reply to a comment
commentController.deleteCommentReply = catchAsync( async (req, res, next) => {
    const { commentId, replyId } = req?.params;
    const currComment = await Comment.findOne({ replyId });
    await currComment.comments.id(commentId).subComments.id(replyId).remove();
    currComment.markModified('subcomments');
    currComment.save();
    res.status(200).send({ message: "Comment Reply Deleted Successfully!" });
})

module.exports = commentController;