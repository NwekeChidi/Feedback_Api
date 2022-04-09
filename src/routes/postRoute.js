const router            = require("express").Router();
const { auth }          = require("../middlewares/auth");
const postController    = require("../controllers/postController");
const commentController = require("../controllers/commentController");

// create post
router.post(
    '/createPost',
    auth,
    postController.createPost
);

// fetch posts
router.get(
    '/:filter/:sortBy',
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
    '/replyComment/:postId/:commentId',
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
    '/deleteComment/:postId/:commentId',
    auth,
    commentController.deleteComment
);

// delete a reply to a comment
router.delete(
    '/deleteCommentReply/:commentId/:replyId',
    auth,
    commentController.deleteCommentReply
);

// upvote post
router.patch(
    '/upvote/:postId',
    auth,
    postController.upvote
);

// get one post
router.get(
    '/:postId',
    postController.getOnePost
)

module.exports = router;