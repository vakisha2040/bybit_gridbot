const axios = require('axios');
const config = require('./config.json');

const SYMBOL = config.symbol || "SOLUSDT";
const INTERVAL = '3m';
const LIMIT = 100;

let currentPosition = null; // 'LONG', 'SHORT', or null

async function fetchCandles(symbol = SYMBOL) {
  const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${INTERVAL}&limit=${LIMIT}`;
  const res = await axios.get(url);
  return res.data.map(c => ({
    openTime: c[0],
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    time: new Date(c[0]).toLocaleTimeString()
  }));
}
 function getIntradaySignal(candles) {
  if (candles.length < 11) return 'WAIT';

  const recent10 = candles.slice(-11, -1); // Previous 10 candles
  const last = candles[candles.length - 1];

  const high10 = Math.max(...recent10.map(c => c.high));
  const low10 = Math.min(...recent10.map(c => c.low));

  // Debug
  console.log(`Last: ${last.close}, H10: ${high10}, L10: ${low10}`);

  if (last.close >= high10) {
    console.log(`📈 BUY at ${last.close} on ${last.time}`);
    return 'BUY';
