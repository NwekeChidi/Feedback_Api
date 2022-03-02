const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config();

const app = require('./app');

//Connecting to the database
let DB = process.env.DB_LOCAL;
if (process.env.NODE_ENV === 'production') {
  DB = process.env.DB_CLOUD;
}

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.log(err));

// Instantiate the HTTP server
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Start the HTTP server
server.listen(port, function () {
  console.log(`Application running on port ${port}`);
});
