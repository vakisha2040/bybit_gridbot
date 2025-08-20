const {
  calculateNextPrice,
  calculateStopLoss,
  fetchPrecision,
  toPrecision,
} = require('./helper');

//require('./telegram'); // ✅ This will start the Telegram bot
const {
  getCurrentPrice,
  waitForFirstPrice,
  startPolling,
  stopPolling
} = require('./priceFeed');

let hedgeToMain = false;
let extremeBoundary = null; // Tracks most aggressive boundary level
let lastBoundaryUpdateTime = 0;
const BOUNDARY_UPDATE_COOLDOWN = 5000; // 3 seconds minimum between updates
const bybit = require('./binanceClient');
const config = require('./config.json');
const state = require('./state');

const { clearBoundary, loadBoundary, saveBoundary } = require('./persistence');

let sendMessage = () => {};
function setSendMessage(fn) {
  sendMessage = fn;
  bybit.setSendMessage(sendMessage);
}

// -- Load boundary state on startup
let { trailingBoundary, boundaries } = loadBoundary();
if (!boundaries){
  boundaries = { top: null, bottom: null };
}
