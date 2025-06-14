const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1d';

function adminController() {
  return {
    // -------------------------------
    // Register Admin
    // -------------------------------
    async registerAdmin(req, res) {
      const { fullName, adminUsername, adminID, email, mobile, password } =
        req.body;

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
          },
        });
      } catch (error) {
        console.error('Error registering admin:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // -------------------------------
    // Admin Login
    // -------------------------------
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

        const payload = {
          id: admin._id,
          adminUsername: admin.adminUsername,
          adminID: admin.adminID,
          email: admin.email,
          mobile: admin.mobile,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

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
          },
        });
      } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // -------------------------------
    // Authenticate Admin Token
    // -------------------------------
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

    // -------------------------------
    // Logout Admin
    // -------------------------------
    logoutAdmin(req, res) {
      return res.status(200).json({
        success: true,
        message: 'Logout successful. Please clear token from client.',
      });
    },

    async updateAdminProfile(req, res) {
      const { currentPassword, updates } = req.body;
      const adminId = req.admin._id;

      try {
        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch)
          return res
            .status(401)
            .json({ message: 'Incorrect current password' });

        if (updates.fullName) admin.fullName = updates.fullName;
        if (updates.adminUsername) admin.adminUsername = updates.adminUsername;
        if (updates.email) admin.email = updates.email;
        if (updates.password)
          admin.password = await bcrypt.hash(updates.password, 10);

        await admin.save();

        const tokenPayload = {
          id: admin._id,
          adminUsername: admin.adminUsername,
          adminID: admin.adminID,
          email: admin.email,
          mobile: admin.mobile,
        };

        const newToken = jwt.sign(tokenPayload, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        const updatedAdmin = {
          id: admin._id,
          fullName: admin.fullName,
          adminUsername: admin.adminUsername,
          adminID: admin.adminID,
          email: admin.email,
          mobile: admin.mobile,
        };

        res.json({
          message: 'Profile updated successfully',
          admin: updatedAdmin,
          token: newToken,
        });
      } catch (err) {
        console.error('Update Admin Error:', err.message);
        res.status(500).json({ message: 'Server error' });
      }
    },

    // -------------------------------
    // Delete Admin (with password check)
    // -------------------------------
    async deleteAdmin(req, res) {
      const adminId = req.params.id;
      const { password } = req.body;

      if (req.admin.id !== adminId) {
        return res.status(403).json({ message: 'Unauthorized.' });
      }

      const admin = await Admin.findById(adminId);
      if (!admin) return res.status(404).json({ message: 'Admin not found' });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      await Admin.findByIdAndDelete(adminId);
      res
        .status(200)
        .json({ success: true, message: 'Admin deleted successfully' });
    },
  };
}

module.exports = adminController;
