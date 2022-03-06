const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const AppError = require('./errors/appError');
const appErrorHandler = require('./errors/app_error_handler');

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Serve static file
app.use(express.static('public'));

// enable cors for all route
app.use(cors())

// enable morgan
app.use(morgan('dev'));


//ROUTES
app.use('/api/v1/users', require('../routes/userRoute'));


app.get('/health', (req, res)=>{
  res.status(200).send('ok')
})

app.all('**', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(appErrorHandler);

module.exports = app;
