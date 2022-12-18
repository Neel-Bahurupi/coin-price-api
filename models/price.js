const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    date:  Date,
    usd: Number
})

module.exports = {
    PriceModel : mongoose.model('Price', priceSchema),
    priceSchema : priceSchema
};