🍽️ TheMenuFy
An intelligent restaurant web application where users can select dishes tailored to their health goals. The app calculates calories, recommends meals using AI, and allows users to place and manage orders.


⚙️ Features – Development
👤 User
Register and log in

Select and customize dishes per mood,weather,timing

View total calories per meal

Add to cart and place orders

View order history

🛠️ Admin
CRUD operations on dishes

Manage user accounts

View usage and order statistics

🧠 Features – AI Integration
Personalized meal recommendations based on health profile

User eating habit analysis

Nutrition chatbot


📡 API Endpoints Overview

| Method | Route                | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/auth/login`    | User login                         |
| POST   | `/api/auth/register` | User registration                  |
| GET    | `/api/dishes`        | Retrieve all available dishes      |
| POST   | `/api/dishes`        | Add a new dish (admin only)        |
| GET    | `/api/user/profile`  | Get user profile with calorie info |
| POST   | `/api/order`         | Submit a new order                 |
| GET    | `/api/order/history` | Fetch user's order history         |
