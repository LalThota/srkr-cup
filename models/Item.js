// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now }
});
    // title: String,
    // description: String,
    // price: Number,
    // imageUrl: String,
    // title: String,
    // description: String,
    // type: { type: String, enum: ['lost', 'marketplace'], required: true },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    // createdAt: { type: Date, default: Date.now },
  
// });

module.exports = mongoose.model('Item', itemSchema);
