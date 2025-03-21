const mongoose = require('mongoose');

const ServiceClosestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
  }, { timestamps: true });
  
  module.exports = mongoose.model('ServiceClosest', ServiceClosestSchema);
  