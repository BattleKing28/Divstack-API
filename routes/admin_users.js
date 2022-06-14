const express = require('express');

const {
   getUsers,
   getUser,
   createUser,
   deleteUser,
   updateUser,
} = require('../controllers/admin_users');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
