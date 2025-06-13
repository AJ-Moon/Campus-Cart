const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Require route files
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");
const bidRoutes = require("./routes/bids");
const settingsRoutes = require("./routes/settings");
const ratingRoutes = require("./routes/ratings");
const userRoutes = require("./routes/users"); // Assuming './routes/users.js' exists
const adminRoutes = require("./routes/admin"); // Assuming './routes/admin.js' exists
const complaintRoutes = require("./routes/complaints"); // Assuming './routes/complaints.js' exists

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app); // Use HTTP server for socket.io

// --- CORS Configuration ---
const allowedOrigins = [
    'http://localhost:3000',                 // Your local React dev server (default port)
    'https://software-eng-project.vercel.app', // Your DEPLOYED frontend URL
    "https://software-eng-project-jet.vercel.app",

];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        // or requests from allowed origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`); // Log blocked origins for debugging
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Add methods used by your frontend
    credentials: true // Important if your frontend sends credentials (cookies, auth headers)
};

// --- Socket.IO Server Setup ---
const io = new Server(server, {
    cors: corsOptions, // Apply the same CORS options to Socket.IO
    // Optional: Add pingTimeout and pingInterval if needed for connection stability
    // pingTimeout: 60000, // Default is 5000ms, increase if needed
    // pingInterval: 25000, // Default is 25000ms
});

// Attach socket instance to app so routes can potentially use it (if needed)
// Note: It's generally better practice to emit events from routes rather than passing io directly
app.set("socketio", io);

// --- Middlewares ---
app.use(cors(corsOptions)); // Use CORS for all Express routes BEFORE defining routes
app.use(express.json());   // Middleware to parse JSON bodies

// --- MongoDB Connection ---
// Ensure MONGO_URI is set in your .env file or Vercel environment variables
if (!process.env.MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in environment variables.");
    process.exit(1); // Exit if the database connection string is missing
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,         // Recommended options, though defaults might suffice in newer Mongoose versions
    useUnifiedTopology: true,
    // Mongoose 6+ no longer supports useFindAndModify and useCreateIndex directly
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    // Consider exiting if the DB connection fails on startup depending on your app's needs
    // process.exit(1);
});

// Handle MongoDB connection events (optional but good for monitoring)
mongoose.connection.on('error', err => {
  console.error(`❌ MongoDB runtime error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
  console.warn('🔌 MongoDB disconnected.');
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);

// Optional: Simple base route to check if the server is up
app.get("/", (req, res) => {
    res.status(200).send("Campus Cart Backend is running!");
});

// --- Socket.IO Connection Handling ---
io.on("connection", (socket) => {
    console.log(`✅ [Socket.IO] User connected: ${socket.id}`);

    // Example: Join a room based on user ID if needed for targeted events
    // socket.on('join_room', (userId) => {
    //   socket.join(userId);
    //   console.log(`User ${socket.id} joined room ${userId}`);
    // });

    socket.on("disconnect", (reason) => {
        console.log(`❌ [Socket.IO] User disconnected: ${socket.id}. Reason: ${reason}`);
    });

    // Add other specific socket event listeners here if needed
    // e.g., socket.on('place_bid', (data) => { /* handle bid */ });
});

// --- Global Error Handling Middleware (Optional but Recommended) ---
app.use((err, req, res, next) => {
    console.error("💥 Unhandled Error:", err.stack || err);
    // Avoid sending stack trace in production
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message;
    res.status(statusCode).json({ msg: message });
});

// --- Start the HTTP Server ---
// Vercel provides the PORT environment variable automatically.
// Fallback to 5005 for local development if process.env.PORT is not set.
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    // Log 0.0.0.0 to indicate it's listening on all available interfaces, common for deployments
    console.log(`🚀 Server running and listening on http://0.0.0.0:${PORT}`);
    console.log(`   Frontend URLs allowed by CORS: ${allowedOrigins.join(', ')}`);
    console.log(`   Local access (if running locally): http://localhost:${PORT}`);
});

// Optional: Graceful shutdown handling
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
