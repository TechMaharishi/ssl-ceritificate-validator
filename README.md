

# SSL Certificate Validator

This project is a web application that validates SSL certificates for a given domain. It provides details such as validity status, expiration date, issuer details, and subject details.

## Setup and Run Instructions

### Prerequisites

- **Node.js** and **npm**: Ensure that Node.js (version 14 or higher) and npm are installed on your machine.

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/ssl-certificate-validator.git
   cd ssl-certificate-validator
   ```

2. **Navigate to the Backend Directory**

   ```bash
   cd backend
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

   The backend server will run on `http://localhost:3000`.

### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the React App**

   ```bash
   npm run dev
   ```

   The React app will run on `http://localhost:5173/`

## Technology Choices

- **Backend**: 
  - **Node.js** with **Express**: Chosen for its ease of setup and robust ecosystem for building RESTful APIs.
  - **TLS Module**: Used to fetch and validate SSL certificates.

- **Frontend**:
  - **React**: Selected for its component-based architecture and efficient rendering.
  - **Tailwind CSS**: Used for styling as it provides utility class to speed up the styling process.

## Assumptions and Design Decisions

- **Domain Input**: Assumes that the user provides a valid domain name in the correct format.
- **Error Handling**: Includes basic error handling for network issues and certificate fetching errors.
- **CORS**: Configured to allow requests from any origin for local development. For production, restrict CORS to specific origins as needed.
- **Design**: The frontend is designed to be simple and functional, focusing on presenting certificate details clearly.

## Known Limitations and Areas for Improvement

- **Security**: The backend currently does not have advanced security features (e.g., input validation).
- **Error Handling**: Error messages are basic and might not cover all edge cases. Improve error handling and user feedback.
- **User Interface**: The frontend UI is minimal. Enhancements can be made for a better user experience and responsiveness.
- **Testing**: Unit and integration tests are not performed.
