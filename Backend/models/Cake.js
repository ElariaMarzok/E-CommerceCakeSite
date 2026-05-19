const mongoose = require('mongoose');
// Bilingual subdocument: es = admin input, en = auto-translated
const localizedString = new mongoose.Schema(
    { 
        en: { type: String, default: '' }, 
        es: { type: String, default: '' } 
    },
    { _id: false }
);

const cakeSchema = new mongoose.Schema({
    name:        { type: localizedString, required: true },
    description: { type: localizedString, default: { en: '', es: '' } },
    category: { type: String, index: true }, 
    images:   [String],                     
    prices: [
        {
            size:  String,
            price: Number,
        }
    ],

    //New: tracks when/what translated it 
    translationMeta: {
        translatedAt: { type: Date },
        provider:     { type: String, default: 'openai' },
    },

}, { timestamps: true });

cakeSchema.pre('find', function () {
    this.sort({ createdAt: -1 });
});


module.exports = mongoose.model('Cake', cakeSchema, 'cakes');