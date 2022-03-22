const ErrorResponse = require('../utils/errResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');

//@decs     get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
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
   let query = Bootcamp.find(JSON.parse(queryStr));

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
   const bootcamps = await query;

   res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
   });
});

//@decs     get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.findById(req.params.id);
   if (!bootcamp) {
      return next(
         new ErrorResponse(
            `Bootcamp not found with id of ${req.params.id}`,
            404
         )
      );
   }
   res.status(200).json({ success: true, data: bootcamp });
});

//@decs     create a bootcamp
//@route    POST /api/v1/bootcamps
//@access   private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.create(req.body);

   res.status(201).json({
      success: true,
      data: bootcamp,
   });
});

//@decs     update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
   });

   if (!bootcamp) {
      return next(
         new ErrorResponse(
            `Bootcamp not found with id of ${req.params.id}`,
            404
         )
      );
   }
   res.status(200).json({ success: true, data: bootcamp });
});

//@decs     delete a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

   if (!bootcamp) {
      return next(
         new ErrorResponse(
            `Bootcamp not found with id of ${req.params.id}`,
            404
         )
      );
   }
   res.status(200).json({ success: true, data: {} });
});
