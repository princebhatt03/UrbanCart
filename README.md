# UrbanCart — E-Commerce Website

## 🌐 Project Overview

**UrbanCart** is a fully responsive and modern **MERN Stack E-Commerce Web Application** developed to simulate a real-world shopping experience. It allows users to browse products, register/login, add items to the cart, and place orders. The app is designed with scalability, reusability, and extensibility in mind. It is ideal for demonstrating **full-stack development skills**.

> **Subtitle**: *Click, Cart, Conquer*

---

## ✨ Features

### 🔑 Authentication

* User Registration
* User Login with JWT
* Protected Routes (Only logged-in users can access cart/checkout)
* Token stored in localStorage

### 🛍️ Product & Cart

* Product Listing with details
* Add to Cart functionality
* View cart items
* Remove items from cart
* Quantity update in cart (optional future feature)

### 🚪 Admin Panel (Coming Soon)

* Product Management (Add/Edit/Delete Products)
* Order Management
* Admin Dashboard

### ⚡ Upcoming Features

* Payment Gateway Integration (Stripe/Razorpay)
* Google OAuth Login
* Product Filtering and Sorting
* Product Search
* Wishlist
* Order History
* Admin CRUD operations

---

## 📂 Project Structure

```
UrbanCart/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
├── README.md
└── package.json
```

---

## ⚙️ Technologies Used

### Frontend (React + Vite + TailwindCSS)

* React.js
* React Router DOM
* Tailwind CSS
* Axios
* Lucide Icons / React Icons

### Backend (Node + Express)

* Node.js
* Express.js
* MongoDB (with Mongoose)
* JWT (jsonwebtoken)
* bcryptjs
* CORS

### Database

* MongoDB (MongoDB Atlas in production)

---

## 🌐 API Endpoints

### **User Auth Routes**

* `POST /api/userRegister` - Register a new user
* `POST /api/userLogin` - Login existing user

### **Product Routes**

* `GET /api/products` - Get all products
* `POST /api/products` - Add product (admin)

### **Cart Routes**

* `POST /api/cart/add` - Add product to cart
* `GET /api/cart` - Get cart items for a user
* `DELETE /api/cart/:id` - Remove item from cart

(Full routes depend on your implementation and may extend further)

---

## 🚀 How It Works

1. **Frontend** built in React using TailwindCSS connects with the Express backend through RESTful APIs.
2. User registers or logs in → JWT Token is saved in localStorage.
3. Authenticated users can browse and add items to the cart.
4. The cart is managed in MongoDB using `userId` for user-specific data.
5. All data is fetched via secure backend routes with validation and error handling.

---

## 📅 Development Timeline

### Phase 1: Core Setup (Done)

* Project boilerplate (frontend/backend separation)
* MongoDB Connection
* User Register/Login
* Cart model and user-specific cart system

### Phase 2: Product & Cart Logic (Done)

* Add to Cart
* View Cart
* Protected Routing

### Phase 3: UI/UX Enhancements (In Progress)

* Responsive Design
* Animated Transitions
* Google Login Button (Frontend Placeholder added)

### Phase 4: Admin & Payments (Planned)

* Admin Product Management
* Stripe or Razorpay Integration
* Order Summary and Status

---

## 📆 Status

* ✅ User Login/Register with JWT Working
* ✅ Add to Cart Functional
* ✅ MongoDB Connected
* ✅ Fully Responsive Design
* ❓ Payment Gateway: Not Yet Implemented
* ❓ Admin Dashboard: Under Development
* ❓ Google Auth: Coming Soon

---

## 🎓 Author

**Prince Bhatt**
Full Stack Web Developer | IoT Engineer
[GitHub: princebhatt03](https://github.com/princebhatt03)

---

## ✨ Contributions

This project is a learning and showcase initiative. Contributions, ideas, and improvements are always welcome!

Feel free to fork, clone, and improve it!

> Made with passion and purpose for real-world application.
