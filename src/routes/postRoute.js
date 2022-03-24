const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

// create post
router.post(
    '/createPost',
    auth,
    postController.createPost
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
    '/comment/:commentId',
    auth,
    commentController.replyComment
);

module.exports = router;