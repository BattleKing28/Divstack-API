const ErrorResponse = require('../utils/errResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

//@description Register a new user
//@route POST /api/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
   const { name, password, role } = req.body;

   const user = await User.create({
      name,
      password,
      role,
   });

   sendTokenResponse(user, 200, res);
});

//@description Login a user
//@route POST /api/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
   const { name, password } = req.body;

   //validation
   if (!name || !password) {
      return next(new ErrorResponse('Please add a name and a password', 400));
   }

   //check if user exists in database
   const user = await User.findOne({ name }).select('+password');

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
//@route GET /api/auth/me
//@access private
exports.getMe = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user.id);
   const token = req.cookies.token;
   res.status(200).json({ success: true, data: user, token });
});
