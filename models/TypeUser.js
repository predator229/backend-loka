const mongoose = require('mongoose');

const typeUserSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });
// const TypeUser = mongoose.model('TypeUser', typeUserSchema);

module.exports = mongoose.model('TypeUser', typeUserSchema);
