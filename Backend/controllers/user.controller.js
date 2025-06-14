const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1d';

function userController() {
  return {
    // -------------------------------
    // Register New User
    // -------------------------------
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

        const newUser = new User({
          fullName,
          username,
          email,
          mobile,
          password: hashedPassword,
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
          },
        });
      } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // -------------------------------
    // Login User & Return JWT Token
    // -------------------------------
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
          },
        });
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // -------------------------------
    // Middleware - Token Authentication
    // -------------------------------
    authenticateToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Access token required.' });
      }

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = decoded;
        next();
      });
    },

    // -------------------------------
    // Logout (Client-side clears token)
    // -------------------------------
    logoutUser(req, res) {
      return res.status(200).json({
        success: true,
        message: 'Logout successful. Please clear token from client.',
      });
    },

    // -------------------------------
    // Update User Profile
    // -------------------------------
    async updateUserProfile(req, res) {
      const userId = req.user.id;
      const { currentPassword, updates } = req.body;

      try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ message: 'Incorrect current password' });
        }

        if (updates.password) {
          updates.password = await bcrypt.hash(updates.password, 10);
        }

        Object.assign(user, updates);
        await user.save();

        const newPayload = {
          id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
        };

        const newToken = jwt.sign(newPayload, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        res.json({
          success: true,
          message: 'Profile updated successfully',
          token: newToken,
          user: newPayload,
        });
      } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // -------------------------------
    // Delete User (with password check)
    // -------------------------------
    async deleteUser(req, res) {
      const userId = req.params.id;
      const { password } = req.body;

      // Ensure the token’s user matches the ID being deleted
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
