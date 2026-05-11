const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // index for quick search by name
  category:{ type: String, index: true },
  images: [String], // مصفوفة روابط الصور
  prices: [
    {
      size: String,
      price: Number
    }
  ],
  
}, { timestamps: true });

// Apply a default descending sort by creation date for all find queries
cakeSchema.pre('find', function() {
  this.sort({ createdAt: -1 });
});

module.exports = mongoose.model('Cake', cakeSchema, 'cakes');


/////////////////////////////////////////////////////////////////////////////////////////////