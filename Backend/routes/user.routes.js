const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')();
const isUserLoggedIn = require('../middlewares/user');
const upload = require('../middlewares/upload');

// Home test route
router.get('/', (req, res) => {
  res.send('User API Working ✅');
});

// Public routes
router.post(
  '/register',
  upload.single('profileImage'),
  userController.registerUser
);
router.post('/login', userController.loginUser);

// Protected routes
router.patch('/update/:id', isUserLoggedIn, userController.updateUserProfile);
router.put(
  '/updateUserProfile',
  isUserLoggedIn,
  upload.single('profileImage'),
  userController.updateUserProfile
);
router.delete('/delete/:id', isUserLoggedIn, userController.deleteUser);

module.exports = router;
