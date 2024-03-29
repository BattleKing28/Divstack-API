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
   //Add user id to req.body
   req.body.user = req.user.id;

   // Checking if publisher has an active course already
   const publishedCourse = await Course.findOne({ user: req.user.id });

   // Checking if logged in user is publisher or admin (admin can add multiple courses but publisher can only add one course)
   if (publishedCourse && req.user.role !== 'admin') {
      return next(
         new ErrorResponse(
            `The user with ID ${req.user.id} has a role of "${req.user.role}" and can only publish a single course`,
            400
         )
      );
   }

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
   let course = await Course.findById(req.params.id);

   if (!course) {
      return next(
         new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
      );
   }

   //Validating the course owner
   if (course.user.toString() !== req.user.id) {
      return next(
         new ErrorResponse(
            `User id  ${req.user.id} is not authorized to update this course`,
            404
         )
      );
   }

   course = await Course.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
   });

   res.status(200).json({ success: true, data: course });
});

//@decs     delete a course
//@route    DELETE /api/v1/courses/:id
//@access   private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
   let course = await Course.findById(req.params.id);

   if (!course) {
      return next(
         new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
      );
   }

   //Validating the course owner
   if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
         new ErrorResponse(
            `User id  ${req.user.id} is not authorized to delete this course`,
            404
         )
      );
   }

   course = await Course.findOneAndDelete(req.params.id);

   res.status(200).json({ success: true, data: {} });
});
