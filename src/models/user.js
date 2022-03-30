const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const userSchema = new Schema({
    fullName : {
        type : String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    profilePhotoUrl : {
        type: String
    },
    company : {
        type: String
    },
    title: {
        type: String
    },
    socialUrl: {
        type: String
    },
    mobile: {
        type: Number
    },
    token : {
        type : String
    },
},
{
    timestamps : {
        createdAt : "created_at",
        updatedAt : "updated_at"
    }
})

module.exports.User = mongoose.model("User", userSchema);