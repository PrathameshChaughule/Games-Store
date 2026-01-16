# 🎮 Gemaring – Online Game Store Website

A modern **online game store web application** built with **React** that simulates a real-world eCommerce platform with **user and admin roles**, **authentication**, **role-based access control**, **admin-controlled frontend content**, and **complete purchase workflows**.

This project is designed as a **strong frontend portfolio project** and focuses on **realistic workflows, maintainability, and professional UI/UX**.

---

## 🚀 Features Overview

### 👤 User Features

* User authentication (Signup / Login)
* Email OTP verification (Signup & Forgot Password)
* Role-based protected routes
* Browse games by category and platform
* View game details with images, price, and discounts
* Wishlist management
* Cart and checkout flow
* Order history and order details
* Download purchased games
* User profile management
* Game request system (request new games)

### 🛠️ Admin Features

* Secure admin authentication
* Role-based access control (Admin/User)
* Admin-only admin creation (no admin signup)
* Admin dashboard with:

  * Revenue analytics (charts)
  * Alerts and system notifications
* Full game management (add / edit / delete)
* Game request management (accept / reject requests)
* Dynamic frontend content control (CMS-like):

  * Hero section image & content
  * Featured games
  * Game news / announcements
* No need to change frontend code for content updates

---

## 🧠 Key Highlights (Why This Project Stands Out)

* **Real-world eCommerce workflow** (wishlist → order → download)
* **User request → admin approval → catalog update** flow
* **Dynamic admin-controlled landing page** (mini CMS)
* **Authentication with OTP-based email verification**
* **Strict role-based access control**
* **Clean, responsive dark-theme UI**
* **Frontend-focused but system-oriented design**

---

## 🧩 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* Chart library (for admin dashboard analytics)

### Backend (Mock / API Simulation)

* JSON Server (REST APIs)
* Hosted on **Render** for production-like usage
* Used for authentication, users, games, orders, requests, and CMS data

---

## 🔐 Authentication & Security

* Signup with email verification using OTP
* Login with role-based redirection
* Forgot password with OTP verification via email
* Role-based route protection (User / Admin)
* Admin accounts can only be created by existing admins

> **Note:** Email OTP functionality is implemented as part of authentication flow. Password hashing and backend email services can be integrated in a production setup.

---

## 🧭 Application Flow

### User Flow

1. Signup → Email verification → Login
2. Browse games → Add to wishlist
3. Add to cart → Place order
4. View order history → Download purchased games
5. Request new games from request page

### Admin Flow

1. Admin login
2. Dashboard overview (revenue + alerts)
3. Review game requests
4. Accept request → Game added to store
5. Manage games, users, and orders
6. Update landing page content dynamically

---

## 📊 Admin Dashboard

* Revenue graph for sales analysis
* Alerts panel for:

  * New game requests
  * Pending actions
  * System updates
* Designed with a **70% analytics / 30% alerts** layout for better usability

---

## 🖥️ Dynamic Frontend Content (CMS-like Feature)

Admins can control key frontend content directly from the dashboard:

* Hero section image and text
* Featured games
* Game news / announcements

Changes reflect immediately on the frontend without redeploying or modifying code.

---

## 🎨 UI / UX Design

* Dark theme tailored for gaming platforms
* Responsive layout for all screen sizes
* Consistent spacing and typography
* Meaningful empty states
* Dashboard-first admin experience

---

## 📁 Folder Structure (Simplified)

```
/src
 ├── components
 ├── admin
 ├── pages
 ├── routes
 ├── hooks
 ├── services (API calls)
 ├── utils
 └── assets
```

---

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/gemaring.git

# Install dependencies
npm install

# JSON Server is already deployed on Render
# Update API base URL in services/api.js if needed

# For local JSON Server (optional)
cd src
cd data
npx json-server --watch db.json --port 3000

# Start the React app
npm run dev

# Clone the repository
git clone https://github.com/your-username/gemaring.git

# Install dependencies
npm install

# Start JSON Server
npx json-server --watch db.json --port 3000

# Start the React app
npm run dev
````

---

## 🔮 Future Improvements

* Replace JSON Server with Node.js + Express backend
* Integrate MongoDB for persistent data
* Password hashing with bcrypt
* JWT-based authentication
* Payment gateway integration
* Advanced admin analytics

---

## 📌 Project Purpose

This project was built to:

* Demonstrate **frontend development skills**
* Showcase **real-world application workflows**
* Highlight **authentication, authorization, and admin systems**
* Serve as a **strong portfolio project for frontend developer roles**

---

## 👨‍💻 Author

<h2 align="center">Author</h2>
<p align="center">
  <strong>Prathamesh Chaughule</strong><br/>
  📧 prathameshChaughule21@gmail.com<br/>
  🎯 Frontend Developer | React Enthusiast
</p>

---

> If you found this project interesting, feel free to ⭐ the repository and explore the code!
