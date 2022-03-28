const router            = require("express").Router();
const { auth }          = require("../middlewares/auth");
const postController    = require("../controllers/postController");
const commentController = require("../controllers/commentController");

// create post
router.post(
    '/createPost',
    auth,
    postController.createPost,
    postController.getAll
);

// fetch posts
router.get(
    '/',
    postController.getAll
);

// comment on a post
router.post(
    '/comment/:postId',
    auth,
    commentController.postComment
);

// reply a comment on a post
router.post(
    '/replyComment/:commentId',
    auth,
    commentController.replyComment
);

// delete a post
router.delete(
    '/deletePost/:postId',
    auth,
    postController.deletePost
);

// delete a comment
router.delete(
    '/deleteComment/:commentId',
    auth,
    commentController.deleteComment
);

// delete a reply to a comment
router.delete(
    '/deleteCommentReply/:commentId/:replyId',
    auth,
    commentController.deleteCommentReply
)

module.exports = router;