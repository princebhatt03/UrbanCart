const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const isAdmin = require('../middlewares/admin');

// POST: Add Product
router.post('/add', isAdmin, upload.single('image'), addProduct);

// GET: All Products
router.get('/', getAllProducts);

// GET: Single Products
router.get('/:id', isAdmin, getProductById);

// UPDATE: Products
router.put('/:id', isAdmin, upload.single('image'), updateProduct);

// DELETE: Products
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;
