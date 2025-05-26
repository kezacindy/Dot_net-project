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
![Screenshot (19)](https://github.com/user-attachments/assets/ec423e16-3f92-42a9-bb2e-9ed437270806)![Screenshot (4)](https://github.com/user-attachments/assets/24db455e-d901-42e8-9eca-e935b955c54f)

![Screenshot (35)](https://github.com/user-attachments/assets/73135de4-6704-4396-a1ee-b14b8f30008c)
![Screenshot (34)](https://github.com/user-attachments/assets/7c3892c1-de73-4e51-bc49-d740ab6a8eb8)
![Screenshot (33)](https://github.com/user-attachments/assets/af3c24d6-6ae5-42d8-946d-8219080cced8)
![Screenshot (32)](https://github.com/user-attachments/assets/e42d20b5-06da-410e-954a-ef99ef7e475f)
![Screenshot (31)](https://github.com/user-attachments/assets/32165d5d-a0c3-4464-bf7d-94b17445edc4)
![Screenshot (30)](https://github.com/user-attachments/assets/3e8e1095-80ec-47b8-9b0c-23fc7f5dd344)
![Screenshot (29)](https://github.com/user-attachments/assets/9d3d26c9-c7e7-4f44-a3c4-2b69af7457db)
![Screenshot (28)](https://github.com/user-attachments/assets/f568484d-e3cc-451a-ae41-90ad5537d461)
![Screenshot (27)](https://github.com/user-attachments/assets/7a22a1b4-a003-451f-9615-de29003bbb46)
![Screenshot (26)](https://github.com/user-attachments/assets/b7eff63f-6e4f-4f69-bfbc-8b5e3d9b4c47)
![Screenshot (25)](https://github.com/user-attachments/assets/67837822-61c6-4ac1-ad7e-31007949a899)
![Screenshot (24)](https://github.com/user-attachments/assets/6e76ab04-d76d-48f1-a0a6-489b0d82c298)
![Screenshot (23)](https://github.com/user-attachments/assets/49bf6fd7-3357-475d-b51c-bfd695e50a29)
![Screenshot (22)](https://github.com/user-attachments/assets/8f161f61-de8d-45af-90dd-374b99f9c125)
![Screenshot (21)](https://github.com/user-attachments/assets/927ddb39-0866-4d8b-a092-6194633376f2)
![Screenshot (20)](https://github.com/user-attachments/assets/21a2c91f-6f59-4f1a-9cdb-40eb0ce226cf)
![Screenshot (19)](https://github.com/user-attachments/assets/ae3b4a94-a854-4700-ae55-022934fbcc41)
![Screenshot (18)](https://github.com/user-attachments/assets/83bce539-57f7-4f0a-bdf3-5b3fb6961f8b)
![Screenshot (17)](https://github.com/user-attachments/assets/99651db4-cdf2-482c-81f1-1d08fc2b77f5)
![Screenshot (16)](https://github.com/user-attachments/assets/f5bae078-c63b-4e5c-a3d1-b1fead0b2253)
![Screenshot (15)](https://github.com/user-attachments/assets/8ea4b184-0a06-4ead-a205-37904ad08681)
![Screenshot (14)](https://github.com/user-attachments/assets/c18ffe24-a2b1-41ae-8405-4d61404b8135)
![Screenshot (13)](https://github.com/user-attachments/assets/c6f0954f-2d85-4dd1-840e-7eb65d0f12ce)
![Screenshot (12)](https://github.com/user-attachments/assets/3da98d19-8ca0-43a0-8ed9-87690ef14d22)
![Screenshot (11)](https://github.com/user-attachments/assets/44d466d5-ba6b-4ad8-9269-08ef79e33153)
![Screenshot (10)](https://github.com/user-attachments/assets/984b0194-ed54-4dcd-8bd0-52355132f84b)
![Screenshot (9)](https://github.com/user-attachments/assets/586098a3-5640-4119-b8a1-179e4ca61a46)
![Screenshot (8)](https://github.com/user-attachments/assets/4a8f5498-bd86-4a56-8181-cd7d2f8fc2a1)
![Screenshot (7)](https://github.com/user-attachments/assets/f6d0e149-5d1a-4f36-aadb-646b20183bca)
![Screenshot (6)](https://github.com/user-attachments/assets/bd688c06-5cef-4683-9681-3e4f39091dcf)
![Screenshot (5)](https://github.com/user-attachments/assets/b73047b8-ae88-46b2-8f23-ce2d8064a775)
![Screenshot (46)](https://github.com/user-attachments/assets/7bea3f84-4de2-4fb1-8766-2ec68d3947a8)
![Screenshot (45)](https://github.com/user-attachments/assets/1e3683d4-a5df-4d65-97a9-3a5671c4b264)
![Screenshot (44)](https://github.com/user-attachments/assets/8ec38749-7f5c-4bce-9c18-cf3644d4c123)
![Screenshot (43)](https://github.com/user-attachments/assets/1eed2f72-604d-4d4d-87b9-dbebeaead01e)
![Screenshot (42)](https://github.com/user-attachments/assets/244f6a66-0f11-4c75-8e1b-ec268cb9b9c8)
![Screenshot (41)](https://github.com/user-attachments/assets/74edf26e-78fc-41e2-ad43-4c4c12df9152)
![Screenshot (40)](https://github.com/user-attachments/assets/103d669a-658d-4455-98e5-bafeeb3bab24)
![Screenshot (39)](https://github.com/user-attachments/assets/485fe593-f29f-4976-956b-d4ede2c543f6)
![Screenshot (38)](https://github.com/user-attachments/assets/0bbc6ea5-5c7b-4506-91b5-c94d523133bc)
![Screenshot (37)](https://github.com/user-attachments/assets/7dab2766-52e3-471c-8b6d-2aebcda6ed48)
![Screenshot (36)](https://github.com/user-attachments/assets/c9f6d962-3814-499b-a6bd-92479c931eee)

![Screenshot (3)](https://github.com/user-attachments/assets/c2527c14-bb90-4498-862f-0c55f6a17d64)
