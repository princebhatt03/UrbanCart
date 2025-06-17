const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')();
const isUserLoggedIn = require('../middlewares/user');
const upload = require('../middlewares/upload');

// Home test route
router.get('/', (req, res) => {
  res.send('User API Working ✅');
});

// Register route
router.post(
  '/register',
  upload.single('profileImage'),
  userController.registerUser
);

// Login route
router.post('/login', userController.loginUser);

// Update Profile route
router.patch('/update/:id', isUserLoggedIn, userController.updateUserProfile);

// Update Profile route
router.put(
  '/updateUserProfile',
  isUserLoggedIn,
  upload.single('profileImage'),
  userController.updateUserProfile
);

// Delete Profile route
router.delete('/delete/:id', isUserLoggedIn, userController.deleteUser);

module.exports = router;
