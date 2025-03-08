const mongoose = require('mongoose');

const userAuthentificateSchema = new mongoose.Schema({
  email: { type: String },
  country: { type: String },
  phoneNumber: { type: String },
  name: { type: String },
  surname: { type: String },
  imgPath: { type: String },
  typeUser: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeUser', required: true },
  coins: { type: Number, required: true },
  selectedPayementMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'SelectedPayement' },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CardModel' }],
  mobils: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mobil' }]
}, { timestamps: true });
// const UserAuthentificate = mongoose.model('UserAuthentificate', userAuthentificateSchema);

module.exports = mongoose.model('UserAuthentificate', userAuthentificateSchema);
