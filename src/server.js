const http = require('http');
require('dotenv').config();

const app = require('./app');

// connect database
require('./db/connectDB');

// Instantiate the HTTP server
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Start the HTTP server
server.listen(port, function () {
  console.log(`Application running on port ${port}`);
});
