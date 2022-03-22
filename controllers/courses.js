const ErrorResponse = require('../utils/errResponse');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');

//@decs     get all courses
//@route    GET /api/v1/courses
//@access   public
exports.getCourses = asyncHandler(async (req, res, next) => {
   //copying req.query
   const reqQuery = { ...req.query };

   //fields to remove
   const removeFields = ['select', 'sort'];

   //loop over removeFields and remove them from reqQuery
   removeFields.forEach((param) => delete reqQuery[param]);
   // console.log(reqQuery);

   //create a query string to perform filtering
   let queryStr = JSON.stringify(reqQuery);

   //creating operators like $gt = greater than , $gte = greater than equal to and so on
   queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
   );

   //finding resources compatible with requested query params (filtering)
   let query = Course.find(JSON.parse(queryStr));

   //select fields to display
   if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
   }

   //select fields to implement sorting
   if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
   } else {
      //default sort by date created
      query = query.sort('-createdAt');
   }

   //executing the query
   const courses = await query;

   res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
   });
});

//@decs     get single course
//@route    GET /api/v1/courses/:id
//@access   public
exports.getCourse = asyncHandler(async (req, res, next) => {
   const course = await Course.findById(req.params.id);
   if (!course) {
      return next(
         new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
      );
   }
   res.status(200).json({ success: true, data: course });
});

//@decs     create a course
//@route    POST /api/v1/courses
//@access   private
exports.createCourse = asyncHandler(async (req, res, next) => {
   const course = await Course.create(req.body);

   res.status(201).json({
      success: true,
      data: course,
   });
});

//@decs     update a course
//@route    PUT /api/v1/courses/:id
//@access   private
exports.updateCourse = asyncHandler(async (req, res, next) => {
   const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
   });

   if (!course) {
      return next(
         new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
      );
   }
   res.status(200).json({ success: true, data: course });
});

//@decs     delete a course
//@route    DELETE /api/v1/courses/:id
//@access   private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
   const course = await Course.findByIdAndDelete(req.params.id);

   if (!course) {
      return next(
         new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
      );
   }
   res.status(200).json({ success: true, data: {} });
});
