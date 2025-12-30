const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "18:00-20:00"
  guests: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);