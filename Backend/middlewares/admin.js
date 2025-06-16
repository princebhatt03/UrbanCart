const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ✅ Middleware to check if admin is authenticated
function isAdminLoggedIn(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if role is admin (optional, based on how you sign the token)
    if (decoded.role && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    req.admin = decoded; // You can access admin ID as req.admin.id
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = isAdminLoggedIn;
