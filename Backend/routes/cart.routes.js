const express = require('express');
const router = express.Router();

const {
  addToCart,
  getUserCart,
  removeFromCart,
} = require('../controllers/cart.controller');

const { authenticateCartUser } = require('../middlewares/cart.auth');

router.post('/add', authenticateCartUser, addToCart);
router.get('/', authenticateCartUser, getUserCart);
router.delete('/remove/:productId', authenticateCartUser, removeFromCart);

module.exports = router;
