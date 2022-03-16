const { Comment } = require('../models/comment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');

const commentController = {}

commentController.postComment = catchAsync( async (req, res, next) =>{
    const { comment } = req.body, postId = req.params.postId;
    if (!comment || !postId) return next(new AppError("No Comment Or Post To Comment On!", 400));

    const data = {
        authorId: req.USER_ID,
        comment
    }
    const newComment = new Comment({ postId });
    newComment.comments.push(data);
    await newComment.save();
    if (!newComment) return next(new AppError("Could Not Comment On Post!", 400));

    res.status(200).send({
        status: "OK",
        newComment
    });
});

module.exports = commentController;