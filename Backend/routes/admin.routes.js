const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller')();
const isAdminLoggedIn = require('../middlewares/admin');
const upload = require('../middlewares/upload');

// ******** ADMIN ROUTES ********

// Admin Registration Route
router.post(
  '/register',
  upload.single('profileImage'),
  adminController.registerAdmin
);

// Admin Login Route
router.post('/login', adminController.loginAdmin);

// Admin Profile Update
router.put(
  '/updateAdminProfile',
  isAdminLoggedIn,
  upload.single('profileImage'),
  adminController.updateAdminProfile
);

// Admin Delete by ID
router.delete('/delete/:id', isAdminLoggedIn, adminController.deleteAdmin);

// Optional: Admin Logout
router.post('/logout', adminController.logoutAdmin);

module.exports = router;
