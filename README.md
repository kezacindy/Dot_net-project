# 🛍️ Burikantu Shopping Web Application

## 📌 Project Overview

**Burikantu Shop App** is a full-stack e-commerce web application that enables users to browse products, manage their shopping cart, place orders, and manage their accounts. Built with a secure and scalable architecture, the application includes user authentication, admin features, and a responsive React frontend.

---

## ⚙️ Technologies Used

### 🔧 Backend – ASP.NET Core Web API
- ASP.NET Core 8+ for server-side logic
- Entity Framework Core for ORM and data access
- JWT (JSON Web Token) for secure, stateless authentication
- ASP.NET Core Identity for user and role management
- CORS policy for cross-origin API access
- RESTful API endpoints

### 🖥️ Frontend – React
- Bootstrapped with **Create React App**
- Axios for API communication
- React Router for client-side routing
- React Hooks for state and lifecycle management

### 🗃️ Database – SQL Server 2022
- Stores user data, product info, cart contents, and order records
- Integrated using Entity Framework Core

---

## 💼 Business Features

- ✅ **User Authentication & Authorization**
  - Register and log in using email/password
  - JWT-based token handling for secured access
  - Role-based access control (user/admin)

- 🛒 **Product Catalog**
  - View, search, and filter products by category
  - View product details (name, price, description, stock)

- 🧺 **Shopping Cart & Orders**
  - Add/remove items in the cart
  - Checkout and place orders
  - View order history

- 🔐 **Admin Tools**
  - Manage users
  - Add/edit/delete products
  - View and manage orders

---

## 🚀 Getting Started

### ▶️ Running the Backend (ASP.NET Core Web API)

1. Open the project in **Visual Studio** or use the **.NET CLI**.

2. Update the database connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=ECommerceDB;Trusted_Connection=True;TrustServerCertificate=True;"
   }



![Screenshot (3)](https://github.com/user-attachments/assets/0ad9babd-c1a8-48c1-b90d-baac08e3ad2b)
![Screenshot (19)](https://github.com/user-attachments/assets/ec423e16-3f92-42a9-bb2e-9ed437270806)

