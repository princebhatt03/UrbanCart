const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  addProduct,
  getAllProducts,
} = require('../controllers/product.controller');
const isAdmin = require('../middlewares/admin');

// POST: Add Product with image upload (image saved to public/uploads/)
router.post('/add', isAdmin, upload.single('image'), addProduct);

// GET: All Products
router.get('/', getAllProducts);

module.exports = router;
