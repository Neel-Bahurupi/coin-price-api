require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const getData = require('./utils');
const mongoString = process.env.DATABASE_URL;
const PriceHistoryModel = require('./models/priceHistory');
const {PriceModel} = require('./models/price');

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(express.json());


app.get('/coinPrice/:coin',async(req, res) =>{
    const price = await getData(req.params.coin);
    res.send({usd :price});
})

app.get('/coinPriceHistory/:coin', async(req, res) => {
    const coin = req.params.coin;
    
    try{
        const data = await PriceHistoryModel.find({name:coin});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

const coinPriceAddInterval = async ()=>{

    const coins = [
        'ETH','BTC','BNB','XRP','ADA','MATIC','DOT','LTC','TRX','SOL',
        'UNI','LINK','ATOM','ETC','FLOW','MANA','SAND','AXS','KLAY',
        'AR','APE','IMX'
    ]

    for(let i = 0; i <coins.length; i++) {
        const usd = await getData(coins[i]);

        const price = new PriceModel({
            date:  new Date(),
            usd : usd
        })

        const priceHistory = (await PriceHistoryModel.find({
                name:coins[i]
            }))[0].price_history;

        priceHistory.push(price);

        const newHistory = await PriceHistoryModel.findOneAndUpdate(
            {
                name:coins[i]
            },
            {
                price_history: priceHistory
            }
        );
        console.log(newHistory);
    }
}

setInterval(coinPriceAddInterval,86400000) //1day inerval

app.post('/add', async(req, res) => {

    const price = new PriceModel({
        date:   new Date(),
        usd : 453
    })

    // const history = new PriceHistoryModel({
    //     name :'ETH',
    //     price_history : [price]
    // })

    const priceHistory = (await PriceHistoryModel.find({name:"ETH"}))[0].price_history;
    priceHistory.push(price);
    await PriceHistoryModel.findOneAndUpdate({name:"ETH"},{price_history: priceHistory});
    res.send(priceHistory);
    // try{
    //     const dataToSave = history.save();
    //     res.status(200).json(dataToSave);
    // }
    // catch(err){
    //     res.status(400).json({message:err.message});
    // }


})

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

// (async()=>{
//     const price = await getData('DOGE');
//     console.log(price);
// })()

