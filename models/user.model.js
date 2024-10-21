import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    //schemaTypes

    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: "default-profile.png",
    },
    bio: {
      type: String,
      maxlength: 160,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      enum: ["author", "user"],
      default: "user",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the Post model
      },
    ],
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export { User };
