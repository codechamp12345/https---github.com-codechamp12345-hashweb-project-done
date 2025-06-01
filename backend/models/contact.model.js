import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide your message'],
    trim: true
  }
}, {
  timestamps: true
});

// Check if the model exists before creating a new one
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact; 