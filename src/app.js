const cors                 = require('cors');
const morgan               = require('morgan');
const express              = require('express');
const AppError             = require('./errors/appError');
// const { cloudinaryConfig } = require('./utils/cloudinary');
const appErrorHandler      = require('./errors/app_error_handler');

// Initalize app
const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable cors for specific route
app.use(cors({
  origin: ["https://shimmering-sprite-84ee41.netlify.app", "http://localhost:3000"],
  credentials: true
}))
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://shimmering-sprite-84ee41.netlify.app');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  next()
})


// enable morgan
app.use(morgan('dev'));

// // config cloudinary
// app.use('*', cloudinaryConfig);

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
