const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports =  ( user_id ) => {
    return {
        sign: jwt.sign( {user_id}, process.env.JWT_SECRET, {expiresIn: 60 * 60})
    }
}