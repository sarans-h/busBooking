const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const BookingSchema = new mongoose.Schema({
  userId: {
    type: 'ObjectId', // Reference to user for now, can later be a reference to a User model
    required: true,
    ref: 'User'
  },
  busId: {
    type: ObjectId, // Reference to the Bus the booking is associated with
    ref: 'Bus',
    required: true
  },
  seats: [{
    type: ObjectId, // Store seat numbers directly for simplicity
    required: true
  }],
  bookingTime: {
    type: Date,
    default: Date.now, // Automatically records booking time
    required: true
  },
  to:{
    type:String,
    required:true
  },
  from:{
    type:String,
    required:true
  },
  journeyDate:{
    type:Date,
    required:true
  },
  fare:{
    type:Number,
    required:true
  },
  status: {
    type: String,
    enum: ['booked', 'canceled', 'completed'],
    default: 'booked'
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
