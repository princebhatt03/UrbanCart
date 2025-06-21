# 🛒 UrbanKart - MERN E-Commerce Platform

UrbanKart is a full-stack E-Commerce web application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It features robust authentication, Google OAuth login, dynamic product management, secure admin/user roles, and fully functional REST APIs.

---

## 🌐 Live Demo

**Website Link:** [Visit Website](https://urbankart-ecommerce.onrender.com)
**Portfolio:** [Visit Portfolio](https://princebhatt03.github.io/Portfolio)

---

## 🧠 Tech Stack

### 🔧 Backend
- **Node.js** with **Express.js**
- **MongoDB Atlas**
- **JWT (JSON Web Token)** for secure authentication
- **Multer** for file/image uploads
- **Bcrypt.js** for password hashing
- **Google OAuth 2.0**
- **Render** for deployment

### 🎨 Frontend
- **React.js** (with Hooks)
- **React Router DOM**
- **Tailwind CSS** for styling
- **Framer Motion** for UI animations
- **Axios** for API calls

---

## 📚 Features

### 👤 User Features
- User Registration & Login (JWT)
- Profile Management with Image Upload
- Google OAuth Login Support
- Delete User Profile with Password Confirmation

### 👨‍💼 Admin Features
- Admin Registration & Login (JWT)
- Google OAuth Admin Registration/Login
- Profile Update & Image Upload
- Secure Password Change Flow
- Delete Admin Profile (Password protected)

### 🛍️ Product Features
- Add, Update, Delete Products (Admin only)
- View All Products (Public)
- View Single Product (Admin only)

---

## 🔐 Authentication & Security

- 🔑 JWT tokens are used for session persistence and route protection.
- 🧠 Admin/User sessions are stored in `localStorage`.
- 🔒 Passwords are securely hashed using Bcrypt.
- 👮 Protected routes using middlewares for both users and admins.
- 🛡️ Secure file/image uploads via Multer middleware.

---

## 🔐 Google OAuth

- Admins and Users can log in using their Google accounts.
- Uses **OAuth 2.0 Authorization Code Flow** for enhanced security.
- Google accounts are flagged internally using a special `_GoogleAuth` password pattern to bypass normal password validation.

---

## 📁 Folder Structure (Backend)

```

UrbanKart/
│
├── controllers/
│ ├── admin.controller.js
│ ├── admin.google.controller.js
│ ├── user.controller.js
│ ├── google.controller.js
│ └── product.controller.js
│
├── middlewares/
│ ├── admin.js
│ ├── user.js
│ └── upload.js
│
├── models/
│ ├── Admin.js
│ ├── User.js
│ └── Product.js
│
├── routes/
│ ├── admin.routes.js
│ ├── user.routes.js
│ ├── product.routes.js
│ └── google.routes.js
│
├── uploads/
├── .env
├── server.js
└── ...

```

## 📮 API Routes

### 🔐 Admin Routes

| Method | Endpoint                          | Protected | Description                        |
|--------|-----------------------------------|-----------|------------------------------------|
| POST   | `/api/admin/register`             | ❌        | Register new admin with image     |
| POST   | `/api/admin/login`                | ❌        | Admin login                        |
| GET    | `/api/admin/google-login`         | ❌        | Admin Google OAuth login           |
| PUT    | `/api/admin/updateAdminProfile`   | ✅        | Update profile with optional image |
| DELETE | `/api/admin/delete/:id`           | ✅        | Delete admin with password check   |
| POST   | `/api/admin/logout`               | ❌        | Logout (handled client-side)       |

---

### 👤 User Routes

| Method | Endpoint                          | Protected | Description                        |
|--------|-----------------------------------|-----------|------------------------------------|
| GET    | `/api/user/`                      | ❌        | Test route                         |
| POST   | `/api/user/register`              | ❌        | Register new user with image       |
| POST   | `/api/user/login`                 | ❌        | User login                         |
| PUT    | `/api/user/updateUserProfile`     | ✅        | Update profile with optional image |
| DELETE | `/api/user/delete/:id`            | ✅        | Delete user with password check    |

---

### 🛍️ Product Routes

| Method | Endpoint              | Protected | Description                |
|--------|-----------------------|-----------|----------------------------|
| POST   | `/api/product/add`    | ✅ (Admin) | Add a new product          |
| GET    | `/api/product/`       | ❌        | Get all products           |
| GET    | `/api/product/:id`    | ✅ (Admin) | Get a single product       |
| PUT    | `/api/product/:id`    | ✅ (Admin) | Update product by ID       |
| DELETE | `/api/product/:id`    | ✅ (Admin) | Delete product by ID       |

---

### 🌐 Google OAuth Routes

| Method | Endpoint                 | Protected | Description                       |
|--------|--------------------------|-----------|-----------------------------------|
| GET    | `/api/google`            | ❌        | Google User OAuth redirect        |
| GET    | `/api/google-login`      | ❌        | Google Admin OAuth redirect       |

---

## 🔑 Environment Variables

```env
PORT=3000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
GOOGLE_CLIENT_ID=<Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth Client Secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/api/admin/google-login
```

📸 Screenshots

![s7](https://github.com/user-attachments/assets/9f4bf388-578d-4a5f-870a-8734ff92af31)
![s8](https://github.com/user-attachments/assets/a5e16270-80f8-48aa-9780-2fd86648639e)

🚀 Getting Started
Backend
cd UrbanKart/Backend
npm install
npm run dev
Frontend
cd UrbanKart/Frontend
npm install
npm run dev

📌 Upcoming Features
🛒 Add to Cart & Wishlist

💳 Payment Gateway Integration

📦 Order Placement & Tracking

📈 Admin Analytics Dashboard

📱 Responsive PWA Support

👨‍💻 Developer
Prince Bhatt

📧 princebhatt316@gmail.com

🌐 Portfolio: https://princebhatt03.github.io/Portfolio

