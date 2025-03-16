const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Uid' }],
  email: { type: String, required: false, unique: true },
  name: { type: String, required: false },
  surname: { type: String, required: false },
  phone: { type: mongoose.Schema.Types.ObjectId, ref: 'Mobil' },
  photoURL: { type: String, required: false },
  role: { type: String, required: false },
  typeUser: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeUser' },
  disabled: { type: Boolean, default: false },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  coins: { type: Number, default: 0 },
  selectedPayementMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'SelectedPayement' },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  mobils: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mobil' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
