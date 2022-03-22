const mongoose = require('mongoose');
const slugify = require('slugify');

const BootcampSchema = new mongoose.Schema({
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
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         'Please enter a valid email',
      ],
   },
   address: {
      type: String,
      required: [true, 'Please add an address'],
   },
   careers: {
      type: [String],
      required: true,
      enum: [
         'Web Development',
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
   averageCost: {
      type: Number,
      default: 0,
   },
});

BootcampSchema.pre('save', function (next) {
   this.slug = slugify(this.name, { lower: true });
   next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
