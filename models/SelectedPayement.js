const mongoose = require('mongoose');

const selectedPayementSchema = new mongoose.Schema({
  mobil: { type: mongoose.Schema.Types.ObjectId, ref: 'Mobil' },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' }
}, { timestamps: true });
// const SelectedPayement = mongoose.model('SelectedPayement', selectedPayementSchema);

module.exports = mongoose.model('SelectedPayement', selectedPayementSchema);
