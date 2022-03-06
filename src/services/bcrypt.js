const bcrypt = require('bcrypt');

exports.hash = (password) => {
    return bcrypt.hash(password, 10);
};

exports.compare = (inPassword, basePassword) => {
    return bcrypt.compare(inPassword, basePassword);
};