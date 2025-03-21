const mongoose = require('mongoose');

const EquimentTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String }
  }, { timestamps: true });
  
  module.exports = mongoose.model('EquimentType', EquimentTypeSchema);
  