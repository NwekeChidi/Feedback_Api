const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    authorName: String,
    authorUserName: String,
    postTag: {
        type: String,
        enum: ["ui", "ux", "enhancement", "bug", "feature"],
        lowercase: true,
        required: true
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    allComments: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
    upvotes: {
        type: Number,
        default: 0
    },
    upvoters: []
},
{
    timestamps : {
        createdAt : "created_at",
        updatedAt : "updated_at"
    }
})

module.exports.Post = mongoose.model("Post", postSchema);