import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const removeAdminCollection = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const adminCollectionExists = collections.some(col => col.name === 'admins');

    if (adminCollectionExists) {
      // Drop the admin collection
      await mongoose.connection.collection('admins').drop();
      console.log('Admin collection dropped successfully');
    } else {
      console.log('Admin collection does not exist in the database');
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    if (error.code === 26) {
      console.log('Admin collection does not exist in the database');
    } else {
      console.error('Error:', error);
    }
    process.exit(1);
  }
};

removeAdminCollection(); 