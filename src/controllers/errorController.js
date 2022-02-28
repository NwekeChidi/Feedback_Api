const AppError = require('../utils/appError');

//Error For Development Mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//Error For Production Mode
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unkknown error: don't want leak details to the client
  } else {
    //1) Log error
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      err,
      message: 'Something went very wrong',
    });
  }
};

//CAST ERROR
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//DUPPLICATE FIELD ERROR
const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate Field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

//VALIDATION ERROR
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//JWT ERROR
const handleJWTError = () => new AppError('Please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError(
    `Token Expired. Date Expired: ${err.expiredAt}. Please Login Again`,
    401
  );

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err, message: err.message };

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiresError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
