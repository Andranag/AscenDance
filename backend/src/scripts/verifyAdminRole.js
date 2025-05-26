const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://andersanagnostou:Nxq8pA9owsyOlj8n@cluster0.0roelyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function verifyAdminRole() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    // Set the role to admin if it's not already
    if (adminUser.role !== 'admin') {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('Updated admin role');
    }

    console.log('Admin user:', adminUser);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

verifyAdminRole();
