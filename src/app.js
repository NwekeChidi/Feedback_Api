const cors            = require('cors');
const morgan          = require('morgan');
const express         = require('express');
const AppError        = require('./errors/appError');
const appErrorHandler = require('./errors/app_error_handler');

// Initalize app
const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable cors for specific route
const allowedOrigins = [
  "https://review-rabbit.netlify.app",
  "https://reviewrabbit.vercel.app",
  "http://localhost:3000"
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use( (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  next()
})


// enable morgan
app.use(morgan('dev'));

//ROUTES
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1', require('./routes/postRoute'));

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
