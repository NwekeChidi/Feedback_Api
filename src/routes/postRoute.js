const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const postController = require("../controllers/postController");

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
)

module.exports = router;