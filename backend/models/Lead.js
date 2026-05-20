const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      enum: ["Website", "LinkedIn", "Instagram", "Referral", "Other"],
      default: "Website"
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted"],
      default: "New"
    },
    notes: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text" });

module.exports = mongoose.model("Lead", leadSchema);
