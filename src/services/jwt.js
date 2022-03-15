const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sign = ( userName ) => {
    return jwt.sign( { userName }, process.env.JWT_SECRET, {expiresIn: 60 * 3600} );
}

exports.decode = ( token ) => {
    return jwt.verify( token, process.env.JWT_SECRET );
}