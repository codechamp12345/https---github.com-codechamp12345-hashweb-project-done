import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log('Database Name:', conn.connection.name);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('MongoDB connection is healthy');
    
  } catch (error) {
    console.error('MongoDB Connection Error Details:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);
    
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

export default connectDB;
