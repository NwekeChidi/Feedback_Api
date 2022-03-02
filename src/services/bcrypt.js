const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');

exports.hash = (password) => {
    return bcrypt.hash(password, 10);
};