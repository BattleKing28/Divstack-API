const mongoose = require('mongoose');
const connectDB = async () => {
   const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
   });

   console.log(
      `Mongo DB connected: ${conn.connection.host}`.cyan.bold.underline
   );
};

module.exports = connectDB;
