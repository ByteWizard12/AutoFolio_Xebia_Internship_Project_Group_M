const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: { type: String },
  planId: { type: String },
  status: { type: String }, // "active", "inactive", "cancelled", etc.
  startedAt: { type: Date },
  endedAt: { type: Date },
}, { _id: false }); // prevent extra _id field inside the embedded doc

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Add the subscription field here
  subscription: subscriptionSchema
});

module.exports = mongoose.model('User', userSchema);
