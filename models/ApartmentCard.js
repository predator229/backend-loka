const mongoose = require('mongoose');

const ApartmentCardSchema = new mongoose.Schema({
    imageUrl: { type: [String], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    descriptionLocation: { type: String },
    location: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    crownPoints: { type: Number, required: true },
    devise: { type: String, required: true },
    perPeriod: { type: String, required: true },
    isFavourite: { type: Boolean, required: true },
    typeApartment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TypeApartment', required: true }],
    nrColoc: { type: Number, required: true },
    nbrNeightbord: { type: Number, required: true },
    caracteristiques: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApartmentCaracteristique', required: false }],
}, { timestamps: true });
  
module.exports = mongoose.model('ApartmentCard', ApartmentCardSchema);
  