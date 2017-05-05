// SWS Keys are Composite
// eg. Term: {year},{quarter}, Course: {year},{quarter},{curriculum},{courseNumber}
const CompositeKey = function () {
  return encodeURI(Array.prototype.slice.call(arguments).join(','));
}

module.exports = { CompositeKey };