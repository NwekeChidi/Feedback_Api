const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const postController = require("../controllers/postController");

// create post
router.post(
    '/createPost',
    auth,
    postController.createPost
);

module.exports = router;