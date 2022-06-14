const ErrorResponse = require('../utils/errResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

//@description Register a new user
//@route POST /api/v1/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
   const { userName, password, role } = req.body;

   const user = await User.create({
      userName,
      password,
      role,
   });

   sendTokenResponse(user, 200, res);
});

//@description Login a user
//@route POST /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
   const { userName, password } = req.body;

   //validation
   if (!userName || !password) {
      return next(
         new ErrorResponse('Please add a userName and a password', 400)
      );
   }

   //check if user exists in database
   const user = await User.findOne({ userName }).select('+password');

   if (!user) {
      return next(
         new ErrorResponse('User with this credentials does not exist', 401)
      );
   }

   //check if password matches the hashed password in database
   const isMatch = await user.matchPassword(password);

   if (!isMatch) {
      return next(
         new ErrorResponse('User with this credentials does not exist', 401)
      );
   }

   sendTokenResponse(user, 200, res);
});

//Get token from model , create a cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
   //create a token
   const token = user.getSignedJwtToken();

   const options = {
      expires: new Date(
         Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
   };

   res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
   });
};

//@description GET current logged in user token
//@route GET /api/v1/auth/me
//@access private
exports.getMe = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user.id);
   const token = req.cookies.token;
   res.status(200).json({ success: true, data: user, token });
});

//@description UPDATE currently logged in user's details
//@route PUT /api/v1/auth/updatedetails
//@access private
exports.updateDetails = asyncHandler(async (req, res, next) => {
   const fieldsToUpdate = { userName: req.body.userName };
   const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
   });
   res.status(200).json({ success: true, data: user });
});

//@description UPDATE currently logged in user's password
//@route PUT /api/v1/auth/updatepassword
//@access private
exports.updatePassword = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user.id).select('+password');

   // check current password
   if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
   }

   user.password = req.body.newPassword;
   user.save();

   sendTokenResponse(user, 200, res);
});
