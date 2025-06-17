const Product = require('../models/product.model');
const path = require('path');
const fs = require('fs');
const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');

// Add Product Controller
const addProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      price,
      description,
      category,
      image: imagePath,
    });

    await product.save();

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Products Controller
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get All Products by ID Controller
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Products
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// DELETE Product Controller
const deleteProduct = async (req, res) => {
  try {
    const { password } = req.body;
    const productId = req.params.id;

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized: Admin not found' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const imagePath = path.join(
      __dirname,
      '..',
      'public',
      'uploads',
      path.basename(product.image)
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await product.deleteOne();

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  getProductById,
  deleteProduct,
};
