# WhatsApp-like Chat Service

## Author

- **Developer**: Anuj Kumar
- **Email**: vikalpraj07@gmail.com
- **GitHub**: [GitHub Profile](https://github.com/Anuj6545)

Feel free to reach out to the developer for any inquiries, suggestions, or collaboration opportunities related to this project.


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a WhatsApp-like chat service that allows users to chat with their friends in real-time. It is built using the MERN (MongoDB, Express, React, Node.js) stack for the backend and React for the frontend. The chat service also features authentication using JSON Web Tokens (JWT) to ensure secure access to the application.

## Features

- User registration and authentication with JWT.
- Real-time chat functionality.
- Create and join chat groups.
- Send and receive text messages.
- View chat history and messages with timestamps.
- Mobile-responsive user interface.

## Technologies Used

- **Frontend**: React.js, Socket.IO for real-time communication.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB for data storage.
- **Authentication**: JWT (JSON Web Tokens).
- **Other Libraries**: Mongoose (for MongoDB), Axios (for API calls), CSS Modules for styling.
- **Deployment**: You can deploy the frontend and backend to platforms like Heroku, Netlify, or Vercel.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the Repository**: Clone this repository to your local machine.

    ```bash
    git clone https://github.com/Anuj6545/whatsapp-chat-service.git
    ```

2. **Set Up the Backend**:
   - Navigate to the `backend` folder.
   - Create a `.env` file in the backend directory to set environment variables such as database connection, JWT secret, and port.

3. **Set Up the Frontend**:
   - Navigate to the `frontend` folder.
   - Update the API URL in the frontend code to point to your backend.

4. **Install Dependencies**:
   - Run `npm install` in both the `frontend` and `backend` directories to install the required dependencies.

5. **Start the Application**:
   - Run the backend server: `npm start` in the `backend` folder.
   - Start the frontend development server: `npm start` in the `frontend` folder.

6. **Access the Application**: Open your browser and access the application at `http://localhost:5173` (or the port you've configured).

## Usage

- Register or log in to access the chat service.
- Create or join chat groups.
- Chat with friends in real-time.
- Enjoy the WhatsApp-like experience!

## API Endpoints

- `/api/auth`: Authentication endpoints (register, login).
- `/api/users`: User-related endpoints (get users).
- `/api/message`: Message-related endpoints (add message, get messages).
- `/api/message/:chatId/:senderId`: Message-related endpoints (get messages between two users).

For more details on API endpoints, check the API documentation in the `backend` directory.

## Contributing

Contributions to this project are welcome. Feel free to open issues, submit pull requests, or suggest new features or improvements.

# Design Document

## Introduction

The WhatsApp-like chat service is designed to provide users with a real-time messaging platform that mimics the functionality of WhatsApp. The primary goal is to facilitate instant communication between users through chat groups. Below, you'll find the key design aspects of this application.

## System Architecture

### Frontend

- **React**: The frontend is built using React.js, a popular JavaScript library for building user interfaces.
- **Socket.IO**: To enable real-time communication and updates between users, Socket.IO is used.

### Backend

- **Node.js and Express.js**: The backend server is built using Node.js and Express.js, providing a RESTful API for the frontend.
- **MongoDB**: Data is stored in a MongoDB database, allowing for flexibility and scalability.
- **JWT (JSON Web Tokens)**: Authentication is implemented using JWT to secure user access.

### Communication

- **Real-Time Communication**: Socket.IO is used for real-time communication between users. This allows messages to be delivered instantly.

## Features

### User Registration and Authentication

- Users can register and log in to the application.
- JWT is used for secure user authentication.

### Chat Groups

- Users can create chat groups and invite friends to join.
- Chat groups are identified by unique IDs and contain multiple members.

### Real-Time Messaging

- Messages are delivered and displayed in real-time to the chat members.
- Users can see when their messages are sent and received.

### Chat History

- Chat history is stored in the database, allowing users to retrieve past messages and view them with timestamps.

### Mobile Responsiveness

- The user interface is designed to be responsive and accessible on various devices, including mobile phones and desktops.

## Data Schema

### User Schema

- Stores user details, including username and password.

### Chat Schema

- Represents chat groups, with an array of members and a unique ID.

### Message Schema

- Contains the content of the messages, sender details, timestamps, and chat group ID.

## Deployment

This WhatsApp-like chat service is deployed in a distributed manner, with the frontend hosted on Netlify and the backend on Render.com. Below are the deployment details:

- **Frontend Deployment (Netlify)**
  - **URL**: [WhatsApp Chat Service](https://friendly-marigold-b2a765.netlify.app/)
  - **Platform**: Netlify, a popular platform for hosting web applications.
  - **Continuous Integration**: The frontend is automatically built and deployed on Netlify whenever changes are pushed to the repository.

- **Backend Deployment (Render.com)**
  - **Platform**: Render.com, a cloud platform for hosting web services.
  - **Backend Server**: The Node.js backend server is deployed on Render.com.
  - **Database**: The MongoDB database is hosted on the cloud (you can specify the MongoDB hosting service you are using).
  
### Deployment Steps

To deploy this application on your own, follow these steps:

1. **Frontend Deployment** (Netlify):
   - Create an account on [Netlify](https://www.netlify.com/) if you don't already have one.
   - Connect your Netlify account to your GitHub repository.
   - Set up your build settings (build command and output folder) in the Netlify dashboard.
   - Trigger automatic deployments through Netlify by pushing changes to the repository.

2. **Backend Deployment** (Render.com):
   - Create an account on [Render.com](https://render.com/) if you don't already have one.
   - Follow Render's documentation to deploy a Node.js application.
   - Set environment variables like database connection, JWT secret, and other configurations.

This distributed deployment setup ensures that the chat service is accessible online for users from the frontend hosted on Netlify, with a secure backend on Render.com.


## Future Enhancements

1. File Sharing: Implement the ability to share files and images within chat groups.
2. Notifications: Add push notifications to alert users of new messages.
3. Emojis and Stickers: Integrate emojis and stickers into the chat.

## Conclusion

In conclusion, this WhatsApp-like chat service provides a versatile platform for real-time communication between users. Developed with the MERN stack and powered by JWT-based authentication, this application offers the following key features:

- Secure User Authentication: Protects user data with JWT tokens, ensuring secure access to the platform.
- Real-time Chatting: Enables users to send and receive messages in real time with their friends.
- Group Creation: Allows users to create new chat groups and invite others to join.
- User Management: Provides features for adding, removing, and managing chat members.
- Distributed Deployment: The frontend is hosted on Netlify, while the backend resides on Render.com, ensuring reliability and scalability.

We encourage you to explore the source code, contribute to its development, and deploy your own instance of this chat service. Thank you for choosing this project, and we hope it serves as a useful foundation for your real-time chat application needs.

