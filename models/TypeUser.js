const mongoose = require('mongoose');

const typeUserSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TypeUser', typeUserSchema);
