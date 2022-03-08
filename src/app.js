const cors            = require('cors');
const morgan          = require('morgan');
const express         = require('express');
const cookieParser    = require('cookie-parser');
const AppError        = require('./errors/appError');
const appErrorHandler = require('./errors/app_error_handler');

const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//Serve static file
app.use(express.static('public'));

// enable cors for all route
app.use(cors())

// enable morgan
app.use(morgan('dev'));


//ROUTES
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/posts', require('./routes/postRoute'));

app.get('/', (req, res) =>{
  res.status(200).send("Welcome To The Home Page Of Feedback Api!")
});
app.get('/health', (req, res)=>{
  res.status(200).send('API IS HEALTHY!')
})

app.all('**', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(appErrorHandler);

module.exports = app;
