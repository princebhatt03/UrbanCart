const Product = require('../models/product.model');

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

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Export controller(s)
module.exports = {
  addProduct,
  getAllProducts,
};
