const mongoose = require('mongoose');

const ApartmentCaracteristiqueSchema = new mongoose.Schema({
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }],
    superficieTotale: { type: String, required: true },
    equipements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApartementEquipement', required: false }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceClosest', required: false }],
  }, { timestamps: true });
  
  module.exports = mongoose.model('ApartmentCaracteristique', ApartmentCaracteristiqueSchema);
  