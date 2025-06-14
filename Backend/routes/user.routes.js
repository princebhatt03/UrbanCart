const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')();
const isUserLoggedIn = require('../middlewares/user');

// Home route
router.get('/', (req, res) => {
  res.render('index');
  console.log('Index page accessed');
});

// ******** USER POST ROUTES ********

// User Registration Route (public)
router.post('/register', userController.registerUser);

// User Login Route (public)
router.post('/login', userController.loginUser);

// User Update Route (protected, update by id param)
router.patch('/update/:id', isUserLoggedIn, userController.updateUserProfile);

// New protected route to update profile using token user ID
router.put(
  '/updateUserProfile',
  userController.authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({ message: 'User ID missing from token' });
      }
      req.params.id = userId;
      await userController.updateUserProfile(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// User Delete Route (protected)
router.delete('/delete/:id', isUserLoggedIn, userController.deleteUser);

module.exports = router;
