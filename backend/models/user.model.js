import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      }
    },
    points: {
      type: Number,
      default: 50, // Signup reward 🎉
    },
    completedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true, // auto-manages createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema);
export default User;
