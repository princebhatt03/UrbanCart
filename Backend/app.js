require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const authRouter = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');

connectToDb();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

app.set('io', io);

// ✅ Socket.IO connection events
io.on('connection', socket => {
  console.log('✅ Socket connected');

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });
});

// ✅ CORS
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECT,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// ✅ Flash
app.use(flash());

// ✅ Uploads folder
const uploadPath = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Routes
app.get('/', (req, res) => {
  const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(redirectUrl);
});

app.use('/auth', authRouter);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = { app, server };
