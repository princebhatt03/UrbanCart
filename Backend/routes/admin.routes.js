const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller')();
const isAdminLoggedIn = require('../middlewares/admin');
const { authenticateAdminToken } = require('../middlewares/authMiddlewar');

// ******** ADMIN ROUTES ********

// Admin Registration Route (Public)
router.post('/register', adminController.registerAdmin);

// Admin Login Route (Public)
router.post('/login', adminController.loginAdmin);

// Admin Profile Update by ID (Protected via custom session middleware)
router.patch(
  '/update/:id',
  isAdminLoggedIn,
  adminController.updateAdminProfile
);

// Admin Profile Update using JWT token (Protected)
router.put(
  '/updateProfile',
  authenticateAdminToken,
  adminController.updateAdminProfile
);

// Admin Delete by ID (Protected via custom session middleware)
// routes/adminRoutes.js
router.delete(
  '/delete/:id',
  authenticateAdminToken,
  adminController.deleteAdmin
);

module.exports = router;
