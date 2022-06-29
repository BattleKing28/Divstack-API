const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
   },
   slug: String,
   description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
   },
   website: {
      type: String,
      match: [
         /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
         'Please enter a valid URL with HTTP or HTTPS',
      ],
   },
   phone: {
      type: String,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
   },
   email: {
      type: String,
      match: [
         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.-\w{2,3})+$/,
         'Please enter a valid email',
      ],
   },
   careers: {
      type: [String],
      required: true,
      enum: [
         'Frontend Development',
         'Backend Development',
         'Mobile Development',
         'UI/UX',
         'Data Science',
         'AI/ML',
         'Business',
         'Other',
      ],
   },
   averageRating: {
      type: Number,
      min: [1, 'Rating must be atleast 1'],
      max: [10, 'Rating cannot be more than 10'],
   },
   photo: {
      type: String,
      default: 'no-photo.jpg',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
   },
   courseType: {
      type: String, //free or premium
      default: 'Free',
   },
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
   },
});

module.exports = mongoose.model('Course', CourseSchema);
