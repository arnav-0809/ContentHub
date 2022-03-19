const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  story: { type: String, required: true },
  date_published: { type: String, required: true },
});

const contentModel = mongoose.model("contentModel", contentSchema);

module.exports = contentModel;
