const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errResponse');
const User = require('../models/User');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
   let token;
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      token = req.headers.authorization.split(' ')[1];
   } else if (req.cookies.token) {
      token = req.cookies.token;
   }
   // console.log(req.cookies);

   //checking if token exists
   if (!token) {
      return next(
         new ErrorResponse('Not authorized to access this route', 401)
      );
   }

   try {
      //verifying the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decodedToken);
      req.user = await User.findById(decodedToken.id);
      next();
   } catch (error) {
      return next(new ErrorResponse('Protected route', 401));
   }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(
            new ErrorResponse(
               `User role (${req.user.role}) is not authorized to use this route`,
               403
            )
         );
      }
      next();
   };
};
