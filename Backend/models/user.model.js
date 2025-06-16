const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },

  // ✅ New field for Profile Image
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
