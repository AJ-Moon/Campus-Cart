🚚 Campus Cart - Dorm Delivery and Bidding System
Campus Cart is a full-stack web application designed to facilitate on-campus deliveries.
Students can post delivery requests from campus restaurants to their dorms, and delivery persons can bid for these deliveries.

Built with MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO for real-time updates.

📋 Features
•⁠ ⁠Student (Customer) Side:

Browse campus restaurants.
Place delivery requests with destination, item details, and bid offer.
View incoming delivery bids.
Accept preferred delivery bid.
Track delivery status in real-time.
Rate the delivery person after completion.
Cancel requests (only before accepting a bid).
•⁠ ⁠Delivery Person Side:

View available delivery requests.
Submit bids with price and estimated time.
Track assigned deliveries.
Update delivery status ("Picked up", "On the way", "Completed").
View their own rating.
•⁠ ⁠Admin Side:

Manage complaints submitted by users.
View and block users if necessary.
•⁠ ⁠Other Key Features:

Live updates using Socket.IO.
JWT-based authentication.
Secure route protection.
Responsive UI with Material UI and custom CSS.
🛠 Tech Stack
•⁠ ⁠Frontend: React.js, React Router, Material-UI, CSS •⁠ ⁠Backend: Node.js, Express.js •⁠ ⁠Database: MongoDB Atlas •⁠ ⁠Real-Time Communication: Socket.IO •⁠ ⁠Authentication: JWT (JSON Web Tokens) •⁠ ⁠Hosting: (Local Development Setup)

🚀 Setup Instructions
1. Clone the repository
⁠ bash git clone cd campus-cart  ⁠

2. Backend Setup
⁠ bash cd backend npm install  ⁠ •⁠ ⁠Create a ⁠ .env ⁠ file inside ⁠ /backend ⁠ with:

⁠  MONGO_URI=<your_mongo_connection_string> JWT_SECRET=<your_jwt_secret>  ⁠ •⁠ ⁠Start backend server: ⁠ bash npm start  ⁠

3. Frontend Setup
⁠ bash cd frontend npm install npm start  ⁠

•⁠ ⁠Runs the React app at ⁠ http://localhost:3000 ⁠. •⁠ ⁠Backend runs at ⁠ http://localhost:5005 ⁠.

📄 Project Structure
backend/ ├── models/ ├── routes/ ├── controllers/ ├── app.js frontend/ ├── src/ ├── components/ ├── assets/ ├── App.js ├── package.json

🌟 Contribution Workflow
•⁠ ⁠Always create a feature branch from ⁠ main ⁠ before making changes. •⁠ ⁠After implementing and testing, create a Pull Request (PR) to merge your branch into ⁠ main ⁠. •⁠ ⁠Main branch should remain stable and production-ready at all times. •⁠ ⁠Final project for Demo 2 will be submitted from a frozen ⁠ demo_2 ⁠ branch copied from ⁠ main ⁠.
