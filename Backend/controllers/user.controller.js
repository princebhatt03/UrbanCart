const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1d';

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function userController() {
  return {
    async registerUser(req, res) {
      const { fullName, username, email, mobile, password } = req.body;

      if (!fullName || !username || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profileImagePath = req.file
          ? `/uploads/${req.file.filename}`
          : '';

        const newUser = new User({
          fullName,
          username,
          email,
          mobile,
          password: hashedPassword,
          profileImage: profileImagePath,
        });

        await newUser.save();

        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            mobile: newUser.mobile,
            profileImage: newUser.profileImage,
          },
        });
      } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    async loginUser(req, res) {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: 'Username and password are required.' });
      }

      try {
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const payload = {
          id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          profileImage: user.profileImage,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            profileImage: user.profileImage,
          },
        });
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    async updateUserProfile(req, res) {
      try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { fullName, username, email, mobile, currentPassword, password } =
          req.body;

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
          return res
            .status(401)
            .json({ message: 'Current password is incorrect' });

        if (req.file) {
          user.profileImage = `/uploads/${req.file.filename}`;
        }

        if (fullName) user.fullName = fullName;
        if (username) user.username = username;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

        const token = generateToken(user._id);
        res.status(200).json({
          message: 'Profile updated successfully',
          user,
          token,
        });
      } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    },

    async deleteUser(req, res) {
      const userId = req.params.id;
      const { password } = req.body;

      if (req.user.id !== userId) {
        return res.status(403).json({ message: 'Unauthorized.' });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      await User.findByIdAndDelete(userId);
      res
        .status(200)
        .json({ success: true, message: 'User deleted successfully' });
    },
  };
}

module.exports = userController;
