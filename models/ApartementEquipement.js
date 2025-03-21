const mongoose = require('mongoose');

const ApartementEquipementSchema = new mongoose.Schema({
    moreinformation: { type: String },
    superficie: { type: String },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'EquimentType' },
  }, { timestamps: true });
  
  module.exports = mongoose.model('ApartementEquipement', ApartementEquipementSchema);
  