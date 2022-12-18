const mongoose = require('mongoose');
const {priceSchema} = require('./price');

const priceHistorySchema = new mongoose.Schema({
    name: String,
    price_history: [priceSchema]
})

module.exports = mongoose.model('PriceHistory', priceHistorySchema)