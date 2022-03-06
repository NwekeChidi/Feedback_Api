const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports =  ( userName ) => {
    return {
        sign: jwt.sign( {userName}, process.env.JWT_SECRET, {expiresIn: 60 * 60})
    }
}