// helper.js
const config = require('./config.json');
let pricePrecision = config.pricePrecision;
let priceStep = config.tickSize;
let boundaryUpdateCount = 0; // Track boundary updates for rate limiting

function fetchPrecision(config = {}) {
  if (typeof config.tickSize === 'number') priceStep = config.tickSize;
  if (typeof config.tickSize === 'number') pricePrecision = getPrecisionFromStep(config.tickSize);
  if (typeof config.pricePrecision === 'number') pricePrecision = config.pricePrecision;
  console.log(`✅ Precision set: step=${priceStep}, digits=${pricePrecision}`);
}

function getPrecisionFromStep(step) {
  if (typeof step !== 'number') return 4;
  const stepString = step.toString();
  return stepString.includes('.') ? stepString.split('.')[1].length : 0;
}

function toPrecision(price) {
  return parseFloat(price.toFixed(pricePrecision));
}

function calculateNextPrice(entry, level, side, gridSpacing) {
  const direction = side === 'Buy' ? -1 : 1;
  return toPrecision(entry + direction * gridSpacing * level);
}

function calculateStopLoss(entry, side, gridSpacing) {
  const direction = side === 'Buy' ? -1 : 1;
  return toPrecision(entry + direction * (gridSpacing / 2));
}

// New boundary calculation functions
function calculateTrailingBoundary(currentPrice, lastBoundary, side, spacing) {
  const buffer = spacing * 0.3; // 30% buffer to prevent whipsaw
