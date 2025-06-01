import mongoose from "mongoose";

const taskCompletionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  pointsEarned: {
    type: Number,
    default: 2
  }
});

const taskSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'YouTube',
      'Instagram',
      'Facebook'
    ],
    required: true
  },
  action: {
    type: String,
    enum: [
      'Like',
      'Subscribe',
      'Follow'
    ],
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        const patterns = {
          YouTube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
          Instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
          Facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/
        };
        return patterns[this.type]?.test(v) || false;
      },
      message: props => `${props.value} is not a valid URL for ${props.type} ${props.action}!`
    }
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completions: [taskCompletionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
