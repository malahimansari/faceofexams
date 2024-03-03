# FaceOfExams

FaceOfExams is a virtual exam platform that allows users to create, manage, and participate in online exams. The application is built using JavaScript, Node.js, Express, MongoDB, and other related technologies.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure user authentication using JSON Web Tokens (JWT).
- **Exam Management:** Create, edit, and delete exams with specified questions and duration.
- **Role-Based Access:** Implement different roles (student, teacher, etc.) with specific access permissions.
- **Virtual Exam Submission:** Users can submit their answers to virtual exams.
- **Scoring Logic:** Implement a scoring system based on the correctness of submitted answers.
- **Dynamic Data Fetching:** Fetch user and exam data dynamically from the MongoDB database.
- **Error Handling:** Proper error messages and status codes for different scenarios.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/malahimansari/faceofexams.git

2. Install Dependencies

  cd faceofexams
  npm install   

3. Set up the environment variables:
Create a .env file in the root directory and add the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Add other environment variables as needed

4.  Run the application:
npm start

Usage
Ensure MongoDB is running.
Access the application at http://localhost:3000 (or another specified port).
Technologies Used
Node.js
Express
MongoDB
Mongoose
JSON Web Token (JWT)
Bcrypt.js
Other npm packages (specified in package.json)
Project Structure
/models: MongoDB schema models.
/routes: Express routes for different features.
/controllers: Request handling logic.
/middlewares: Custom middleware functions.
/config: Configuration files.
/public: Static assets (if any).
/views: Frontend views (if applicable).

API Endpoints
POST /login: User login endpoint.
POST /submit/:room_id: Endpoint for submitting exam answers.
**Other endpoints for exam management, user registration, etc.
