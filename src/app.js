const express = require('express');
const cors = require('cors');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Serve static file
app.use(express.static('public'));

// enable cors for all route
app.use(cors())

//ROUTES   


app.get('/health', (req, res)=>{
  res.status(200).send('ok')
})

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
