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

// enable cors for specific route
app.use(cors({
  origin: ['http://localhost', 'http://localhost:3000', 'http://localhost:3001', "http://localhost:3002"],
  credentials: true
}))
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
})

// enable morgan
app.use(morgan('dev'));


//ROUTES
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1', require('./routes/postRoute'));

app.get('/home', (req, res) =>{
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
