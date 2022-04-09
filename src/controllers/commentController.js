const { Post }    = require('../models/post');
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
        authorName: req.fullName,
        comment,
        sorter: 1
    }
    
    // check if posts already has comments
    let currComment = await Comment.findOne({ postId });

    // get post
    let post = await Post.findOne({ _id: postId });
    if (!post) return next(new AppError("Post Not Found!", 404));

    if (currComment){
        data.sorter += currComment.comments.length;
        currComment.comments.push(data);
        await currComment.save();
    } else {

        currComment = new Comment({ postId });
        currComment.comments.push(data);
        await currComment.save();
        post.comments.push(currComment?._id);
    }
    await post.save();

    if (!currComment) return next(new AppError("Could Not Comment On Post!", 403));
    const comments = currComment.comments;
    comments.sort((a, b) => b.sorter - a.sorter)

    res.status(200).send({
        status: "OK",
        comments,
    });
});

// reply a comment
commentController.replyComment = catchAsync( async (req, res, next) =>{
    const { comment } = req.body, commentId = req.params.commentId, postId = req.params.postId;
    if (!comment || !commentId) return next(new AppError("No Reply or comment to reply!", 400));

    const data = {
        author: req.USER_ID,
        authorName: req.fullName,
        comment,
        sorter: 1
    }
    
    // check if posts already has sub comments
    const allComments = await Comment.findOne({ postId });
    if (!allComments) return next(new AppError(`Could Not Find All Comments This Id ${postId}`, 400));

    const currComment = allComments.comments.id(commentId);
    if (!currComment) return next(new AppError(`Could Not Find A Comment With This Id ${commentId}`, 400));
    

    const subComments = currComment.subComments; 
    if (subComments?.length > 0){
        data.sorter += subComments.length;
        allComments.comments.id(commentId).subComments.push(data);
    } else {
        allComments.comments.id(commentId).subComments.push(data);
    }
    await allComments.save();
    
    const allCommentReplies = allComments.comments.id(commentId).subComments;
    allCommentReplies.sort((a, b) => b.sorter - a.sorter)

    res.status(200).send({
        status: "OK",
        allCommentReplies
    });
});

// Delete comment
commentController.deleteComment = catchAsync( async (req, res, next) => {
    const commentId = req.params?.commentId, postId = req.params?.postId;

    const allComments = await Comment.findOne({ postId });
    if (!allComments) return next(new AppError(`Could Not Find All Comments This Id ${postId}`, 400));

    const currComment = allComments.comments.id(commentId);
    if (!currComment) return next( new AppError(`Comment with id: ${commentId}, not found!`));
    // get postId
    const post = await Post.findById({ _id: postId });
    post.comments.splice(post.comments.indexOf(commentId), 1);
    await post.save();

    await allComments.comments.id(commentId).remove();
    allComments.markModified('comments');
    await allComments.save();

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