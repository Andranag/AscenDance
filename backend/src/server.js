const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

app.use("/users", userRoutes);

// Start server

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
