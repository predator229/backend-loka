const mongoose = require('mongoose');

const JournalCardSchema = new mongoose.Schema({
    date: { type: String, required: true },
    apartmentCard: { type: mongoose.Schema.Types.ObjectId, ref: 'ApartmentCard', required: true },
    status: { type: Number, required: true }
  }, { timestamps: true });
  
  module.exports = mongoose.model('JournalCard', JournalCardSchema);
  