const express = require('express');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
   getCourses,
   getCourse,
   createCourse,
   updateCourse,
   deleteCourse,
} = require('../controllers/courses');

router.route('/').get(getCourses).post(protect, createCourse);

router
   .route('/:id')
   .get(getCourse)
   .put(protect, authorize('publisher'), updateCourse)
   .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;
