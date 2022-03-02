const AppError = require('./appError');
require('dotenv').config();

module.exports = (err, req, res, next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
          });
        return;
    }

    if (process.env.NODE_ENV === 'production' && err instanceof AppError){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        return;
    }
    console.log(err)
    res.status(500).json("Something Went Wrong!");
}