# 🔑 User Authentication System
## Overview
This project implements a user registration and login system with a backend server and a frontend interface. Users can create accounts, log in, and access protected routes. The backend handles user authentication, data storage, and API endpoints, while the frontend provides the user interface for interacting with the system.

## Technologies Used
### Backend
Node.js: JavaScript runtime environment for the server.
Express: Web application framework for Node.js.
MongoDB: NoSQL database for storing user information.
Mongoose: MongoDB object modeling tool for Node.js.
bcrypt: Library for hashing passwords.
jsonwebtoken (JWT): Library for creating and verifying tokens for authentication.
cors: Middleware to enable Cross-Origin Resource Sharing.
### Frontend
HTML: Structures the webpage.
CSS: Styles the webpage.
JavaScript: Handles user interaction and API calls.
## Setup
### Backend
Clone the repository: \
Bash

git clone https://github.com/balota-natan-utcn/registration-login.git \
Navigate to the backend directory: \
Bash

cd YOUR_REPO_NAME/backend \
Install dependencies: \
Bash

npm install \
Set up environment variables: \
Create a .env file in the backend directory. \
Add your MongoDB connection string:
MONGODB_URI=mongodb+srv://balotan61:xxxxxxxxxx@td-db.e9xh2sx.mongodb.net/logindb \
Set a secure JWT secret:
JWT_SECRET=your-secret-key \
Important: Replace your-secret-keywith a strong, unique secret in a production environment. \
Start the server:\
Bash

npm start \
The server should start on port 3100. \
### Frontend
Navigate to the frontend directory: \
Bash 

cd ../frontend \
Open index.html in your web browser.
## Usage
### Registration:
Navigate to the registration form by clicking "Sign up here". \
Enter your email, password, and other optional details. \
Click "Create Account" to register.
### Login:
Navigate to the login form (if not already there). \
Enter your registered email and password. \
Click "Sign In" to log in.
### Dashboard:
After successful login/registration, you'll be redirected to the dashboard. \
The dashboard displays your user information. \
You can use the buttons to: \
Get Profile: Fetch and display your user profile data. \
Get All Users: Fetch and display a list of all registered users (protected route). \
Test Backend: Check if the backend server is running and responding. \
Logout: Clear your authentication data and return to the login screen.
## Contributing
Feel free to contribute to this project by:

Reporting issues. \
Suggesting improvements. \
Submitting pull requests. \
