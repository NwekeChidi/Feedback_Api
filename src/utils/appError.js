class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error;';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }

    // request error
    static badRequest(msg) {
      return new AppError(400, msg);
    }

    // server error
    static internal(msg) {
      return new AppError(500, msg);
    }
  }
  
  
  module.exports = AppError;
  