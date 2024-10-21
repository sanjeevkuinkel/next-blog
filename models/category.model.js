import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
  postCount: {
    type: Number,
    default: 0,
  },
});
const Category = mongoose.model("Category", categorySchema);
