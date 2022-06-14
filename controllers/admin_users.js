const ErrorResponse = require('../utils/errResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

//@description Get all users
//@route GET /api/v1/users
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
   const users = await User.find();
   res.status(200).json({
      success: true,
      data: users,
   });
});

//@description Get single user
//@route GET /api/v1/users/:id
//@access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.params.id);
   if (!user) {
      return next(
         new ErrorResponse(
            `Could not find the user with the id of ${req.params.id}`,
            404
         )
      );
   }
   res.status(200).json({ success: true, data: user });
});

//@description Create a user
//@route POST /api/v1/users
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
   const user = await User.create(req.body);
   res.status(200).json({ success: true, data: user });
});

//@description Update a user
//@route PUT /api/v1/users/:id
//@access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
   });
   if (!user) {
      return next(
         new ErrorResponse(
            `Could not find the user with the id of ${req.params.id}`,
            404
         )
      );
   }
   res.status(200).json({ success: true, data: user });
});

//@description Delete a user
//@route DELETE /api/v1/users/:id
//@access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
   const user = await User.findByIdAndDelete(req.params.id);
   if (!user) {
      return next(
         new ErrorResponse(
            `Could not find the user with the id of ${req.params.id}`,
            404
         )
      );
   }
   res.status(200).json({ success: true, data: {} });
});
