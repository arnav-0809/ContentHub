const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email_id: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
