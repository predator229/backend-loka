const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    moreinformation: { type: String },
    superficie: { type: String, required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType', required: true},
  }, { timestamps: true });
  
  module.exports = mongoose.model('Room', RoomSchema);
  