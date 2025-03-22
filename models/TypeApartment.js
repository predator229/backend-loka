const mongoose = require('mongoose');

const TypeApartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TypeApartment', TypeApartmentSchema);
  