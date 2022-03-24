const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env variables
dotenv.config({ path: './configs/config.env' });

//load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   // useCreateIndex: true,
   // useFindAndModify: false,
   useUnifiedTopology: true,
});

//read json files
const bootcamps = JSON.parse(
   fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
   fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
const users = JSON.parse(
   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

//import all bootcamps to DB
async function importData() {
   try {
      await Bootcamp.create(bootcamps);
      await Course.create(courses);
      await User.create(users);
      console.log('data imported...'.green.inverse);
      process.exit();
   } catch (err) {
      console.log(err);
   }
}

//delete all bootcamps from DB
async function deleteData() {
   try {
      await Bootcamp.deleteMany();
      await Course.deleteMany();
      await User.deleteMany();
      console.log('data deleted...'.red.inverse);
      process.exit();
   } catch (err) {
      console.log(err);
   }
}

//checking from console if user wants to import or delete the data from DB
if (process.argv[2] === '-i') {
   importData();
} else if (process.argv[2] === '-d') {
   deleteData();
}
