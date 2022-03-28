const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sign = ( userName ) => {
    return jwt.sign( { userName }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 } );
}

exports.decode = ( token ) => {
    return jwt.verify( token, process.env.JWT_SECRET );
}