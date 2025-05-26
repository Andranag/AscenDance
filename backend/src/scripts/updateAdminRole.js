const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://andersanagnostou:Nxq8pA9owsyOlj8n@cluster0.0roelyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function updateAdminRole() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find and update the admin user
    const user = await User.findOne({ email: 'admin@example.com' });
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log('Updated admin user:', user);
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateAdminRole();
