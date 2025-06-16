const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller')();
const isAdminLoggedIn = require('../middlewares/admin'); // JWT-based auth
const upload = require('../middlewares/upload');

// ******** ADMIN ROUTES ********

// Admin Registration Route (Public, with image)
router.post(
  '/register',
  upload.single('profileImage'),
  adminController.registerAdmin
);

// Admin Login Route (Public)
router.post('/login', adminController.loginAdmin);

// Admin Profile Update using JWT token (Protected)
router.put(
  '/updateAdminProfile',
  isAdminLoggedIn,
  upload.single('profileImage'),
  adminController.updateAdminProfile
);

// Admin Delete by ID (Protected via JWT)
router.delete('/delete/:id', isAdminLoggedIn, adminController.deleteAdmin);

// Optional: Admin Logout (Client just removes token)
router.post('/logout', adminController.logoutAdmin);

module.exports = router;
