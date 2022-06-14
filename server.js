const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./configs/db');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser'); //did not use cookie parser in app.use() thats why got undefined token error (proper error -  "error": "Cannot read property 'token' of undefined")

//importing routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const admin_users = require('./routes/admin_users');

//Load env file
dotenv.config({ path: './configs/config.env' });

//Connect to DB
connectDB();

const app = express();

//body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}

const PORT = process.env.PORT;

//mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', admin_users);

app.use(errorHandler);

const server = app.listen(PORT, () => {
   console.log(
      `server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
         .bold
   );
});

//handle promise rejection during db connection
process.on('unhandledRejection', (err, promise) => {
   console.log(`Error: ${err.message}`.red.underline);
   //close server and exit process
   server.close(() => process.exit(1));
});
