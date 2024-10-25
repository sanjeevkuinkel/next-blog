import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: { type: Date, required: true },
});

export const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
