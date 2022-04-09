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
                authorName: String,
                authorUserName: String,
                comment: { type: String },
                time: {type: Date, default: new Date()},
                sorter : { type: Number },
                subComments: [ 
                    { 
                        author: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                            index: true
                        },
                        authorName: String,
                        authorUserName: String,
                        comment: {type: String},
                        time: {type: Date, default: new Date()},
                        sorter: { type: Number }
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