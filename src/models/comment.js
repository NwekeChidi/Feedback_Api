const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const commentSchemma = new Schema(
    {
        postId : {
            type: Schema.Types.ObjectId,
            ref: "Post",
            index: true
        },
        comments: [
            {
                author: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    index: true
                },
                comment: { type: String },
                time: {type: Date, default: new Date()},
                subComment: [ 
                    { 
                        author: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                            index: true
                        },
                        comment: {type: String},
                        time: {type: Date, default: new Date()}
                    }
                ]
            }
        ],
    },
    {
        timestamps: {
            createdAt : "created_at",
            updatedAt : "updated_at"
        }
    }
);

module.exports.Comment = mongoose.model("Comment", commentSchemma);