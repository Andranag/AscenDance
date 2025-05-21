const express = require("express");
const cors = require("cors");

const main = require("./config/connection");
const userRoutes = require("./routes/userRoutes");
const classRoutes = require("./routes/classRoutes");

const app = express();
const port = process.env.PORT || 3050;

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend development server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

main();

app.use("/user", userRoutes);
app.use("/classes", classRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});
