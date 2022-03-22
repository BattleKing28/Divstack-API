const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please add name'],
   },
   role: {
      type: String,
      enum: ['user', 'admin', 'publisher'],
      default: 'user',
   },
   password: {
      type: String,
      required: [true, 'Please add password'],
      minlength: 6,
      select: false,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

//Hashing the password before storing it in the database
UserSchema.pre('save', async function (next) {
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

//Sign user in and return JWT token
UserSchema.methods.getSignedJwtToken = function () {
   return jwt.sign(
      {
         id: this._id,
      },
      process.env.JWT_SECRET,
      {
         expiresIn: process.env.JWT_EXPIRE,
      }
   );
};

//match hashed password with the user entered password
UserSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
