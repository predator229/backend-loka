const mongoose = require('mongoose');

const mobilSchema = new mongoose.Schema({
  digits: { type: String, required: true },
  indicatif: { type: String, required: true },
  title: { type: String, required: false }
}, { timestamps: true });
// const Mobil = mongoose.model('Mobil', mobilSchema);

module.exports = mongoose.model('Mobil', mobilSchema);
