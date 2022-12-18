const CoinMarketCap = require('coinmarketcap-api')
const client = new CoinMarketCap('ef13a8cc-9bd4-449b-9140-ffc9bdaaa45e')

let data;
const getData = async(symbol)=>{
    data = (await client.getQuotes({symbol: symbol})).data;
    const symb = (Object.keys(data)[0]);
    return (data[symb].quote.USD.price);
}

module.exports = getData;