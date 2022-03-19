const mongoose = require("mongoose");

const userInteractionSchema = new mongoose.Schema({
  content_id: { type: String, required: true },
  likes: { type: [String], required: true },
  reads: { type: [String], required: true },
  likes_count: { type: Number, required: true },
  reads_count: { type: Number, required: true },
});

const userInteractionModel = mongoose.model(
  "userInteractionModel",
  userInteractionSchema
);

module.exports = userInteractionModel;
