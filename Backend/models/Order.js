const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    notes: String
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  // status: { type: String, enum: ['Pending', 'Delivered'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);