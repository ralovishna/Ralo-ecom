# 🛍️ RaloEcom

**RaloEcom** is a full-stack, multi-vendor e-commerce platform supporting Admin, Seller, and Customer roles. Built with **React**, **Spring Boot**, **Redux**, and **MySQL**, it offers real-time features like dynamic dashboards, product filtering, secure OTP-based login, Razorpay integration, and more.

---

## 📁 Project Type

**Type**: Full-Stack Web Application  
**Status**: In Development  
**Purpose**: Learning, Portfolio Showcase

---

## 🚀 Tech Stack

### Frontend
- React
- Redux Toolkit
- Tailwind CSS + Material UI
- Axios
- Cloudinary (Image Upload)

### Backend
- Spring Boot (Java)
- MySQL
- JWT Authentication
- Email OTP Verification
- REST APIs

### Payments & Deployment
- Razorpay Integration
- Docker-Ready Backend (Not Deployed Yet)

---

## 🧩 Key Features

### 🔐 Authentication & Authorization
- JWT-based login for all users
- OTP email verification for Customers and Sellers
- Seller email status & account status flow (6 total statuses)
- Role-based access controls for routes and actions

### 🛒 Customer Module
- Browse products with **filters (price, color, discount)** and **sorting**
- Add to **cart**, **wishlist**, and **multiple shipping addresses**
- Apply **coupons** with live cart updates
- Track order status in real time
- Add **reviews and ratings**

### 🧑‍💼 Seller Module
- Add/update/delete products (with multiple image upload)
- Manage own orders and update status
- Seller dashboard with revenue and order stats
- Separate Redux slice for seller login/session

### 👑 Admin Module
- Role-based admin dashboard with:
  - Line and Pie charts for users, revenue, orders, products
- Manage coupons with rules:
  - `minCartAmount`, first-time user, category-specific
- Approve/reject/verify seller accounts

### 📦 Orders & Checkout
- Multi-vendor architecture at checkout
- Order splits based on sellers
- Razorpay integrated for payment
- Order tracking updates per seller

### 🔍 Categories & Search
- 3-Level category system: e.g., `Men > Topwear > T-Shirts`
- Product search by name, brand, or category
- Brand stored as string (not separate entity)

### 📬 Notifications
- Notification system for all major actions (e.g., order updates, status changes)

---

## 📷 Screenshots

Coming soon...

---

## 🛠️ Getting Started (Dev Mode)

### Prerequisites
- Node.js
- Java 17+
- MySQL
- Maven

### Setup Instructions

#### Backend (Spring Boot)
```bash
cd backend
# Update application.properties with your MySQL config
./mvnw spring-boot:run
