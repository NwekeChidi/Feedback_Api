const mongoose = require('mongoose');

//Connecting to the database
let DB = process.env.DB_LOCAL;
if (process.env.NODE_ENV === 'production') {
  DB = process.env.DB_CLOUD;
}

( () => {
        mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log(':>>>>>>> DB Connection Successful'))
        .catch((err) => console.log(':<<<<<<< DB Connection Failed'));
    }
)();