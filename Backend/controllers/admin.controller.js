const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1d';

function generateAdminToken(admin) {
  return jwt.sign(
    {
      id: admin._id,
      adminUsername: admin.adminUsername,
      adminID: admin.adminID,
      email: admin.email,
      mobile: admin.mobile,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function adminController() {
  return {
    // Register Admin
    async registerAdmin(req, res) {
      const { fullName, adminUsername, adminID, email, mobile, password } =
        req.body;
      const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

      if (
        !fullName ||
        !adminUsername ||
        !adminID ||
        !email ||
        !mobile ||
        !password
      ) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      try {
        const existingAdmin = await Admin.findOne({ adminUsername });
        if (existingAdmin) {
          return res
            .status(409)
            .json({ message: 'Admin username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
          fullName,
          adminUsername,
          adminID,
          email,
          mobile,
          password: hashedPassword,
          profileImage,
        });

        await newAdmin.save();

        return res.status(201).json({
          success: true,
          message: 'Admin registered successfully',
          admin: {
            id: newAdmin._id,
            fullName: newAdmin.fullName,
            adminUsername: newAdmin.adminUsername,
            adminID: newAdmin.adminID,
            email: newAdmin.email,
            mobile: newAdmin.mobile,
            profileImage: newAdmin.profileImage,
          },
        });
      } catch (error) {
        console.error('Error registering admin:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // Admin Login
    async loginAdmin(req, res) {
      const { adminUsername, adminID, password } = req.body;

      if (!adminUsername || !adminID || !password) {
        return res
          .status(400)
          .json({ message: 'All login fields are required.' });
      }

      try {
        const admin = await Admin.findOne({ adminUsername, adminID });
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = generateAdminToken(admin);

        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          admin: {
            id: admin._id,
            fullName: admin.fullName,
            adminUsername: admin.adminUsername,
            adminID: admin.adminID,
            email: admin.email,
            mobile: admin.mobile,
            profileImage: admin.profileImage,
          },
        });
      } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // Authenticate Admin Token
    authenticateAdminToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Access token required.' });
      }

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.admin = decoded;
        next();
      });
    },

    // Logout Admin
    logoutAdmin(req, res) {
      return res.status(200).json({
        success: true,
        message: 'Logout successful. Please clear token from client.',
      });
    },

    // Update Admin Profile
    async updateAdminProfile(req, res) {
      try {
        const adminId = req.admin.id;
        const admin = await Admin.findById(adminId);

        if (!admin) {
          return res.status(404).json({ message: 'Admin not found' });
        }

        const { fullName, adminUsername, email, password, currentPassword } =
          req.body;

        if (!(await bcrypt.compare(currentPassword, admin.password))) {
          return res
            .status(401)
            .json({ message: 'Current password is incorrect' });
        }

        if (fullName) admin.fullName = fullName;
        if (adminUsername) admin.adminUsername = adminUsername;
        if (email) admin.email = email;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(password, salt);
        }
        if (req.file) {
          admin.profileImage = `/uploads/${req.file.filename}`;
        }

        await admin.save();

        const token = generateAdminToken(admin);
        res.status(200).json({
          message: 'Admin updated',
          admin,
          token,
        });
      } catch (error) {
        console.error('Admin profile update error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // Delete Admin
    async deleteAdmin(req, res) {
      try {
        const adminId = req.params.id;
        const { password } = req.body;

        // Validate input
        if (!password) {
          return res.status(400).json({ message: 'Password is required.' });
        }

        // Ensure the logged-in admin is deleting their own account
        if (req.admin.id !== adminId) {
          return res.status(403).json({ message: 'Unauthorized access.' });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Incorrect password.' });
        }

        await Admin.findByIdAndDelete(adminId);

        return res.status(200).json({
          success: true,
          message: 'Admin account deleted successfully.',
        });
      } catch (error) {
        console.error('Error deleting admin:', error);
        return res
          .status(500)
          .json({ message: 'Server error. Try again later.' });
      }
    },
  };
}

module.exports = adminController;
