const express = require("express");
const cors = require("cors");

const main = require("./config/connection");
const userRoutes = require("./routes/userRoutes")
const classRoutes = require("./routes/classRoutes")

const app = express();
const port = process.env.PORT || 3050;

app.use(express.json());
app.use(cors());

main();

app.use("/user", userRoutes);
app.use("/classes", classRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});
