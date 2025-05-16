const mongoose = require('mongoose');

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database is connected with success!");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
}

module.exports = main;