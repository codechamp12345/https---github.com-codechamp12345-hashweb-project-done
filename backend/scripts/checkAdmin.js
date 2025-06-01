import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const MONGO_URI = 'mongodb+srv://patilchandan433:kgqFaPxDLJefSTAK@cluster0.rnw9dbh.mongodb.net/hashweb?retryWrites=true&w=majority';

const checkAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const admin = await Admin.findOne({ username: 'admin' });
    if (admin) {
      console.log('Admin user exists:', admin.username);
    } else {
      console.log('Admin user does NOT exist.');
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAdmin(); 