const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message,
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: 'Cart is empty',
        items: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found for user',
      });
    }

    const updatedItems = cart.items.filter(
      item => item.product.toString() !== productId
    );

    cart.items = updatedItems;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getUserCart,
  removeFromCart,
};
