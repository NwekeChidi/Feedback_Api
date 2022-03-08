const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const postSchema = new Schema({
    feedback: {
        type: String,
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: "User"
    },
    upvotes: {
        type: Number
    }
},
{
    timestamps : {
        createdAt : "created_at",
        updatedAt : "updated_at"
    }
})

module.exports.Post = mongoose.model("Post", postSchema);