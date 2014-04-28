var DOUBLE_VIEW = new Float64Array(1)
  , UINT_VIEW   = new Uint32Array(DOUBLE_VIEW.buffer)

DOUBLE_VIEW[0] = 1.0
if(UINT_VIEW[1] === 0x3ff00000) {
  //Use little endian
  module.exports = function doubleBitsLE(n) {
    DOUBLE_VIEW[0] = n
    return [ UINT_VIEW[0], UINT_VIEW[1] ]
  }
  function toDoubleLE(lo, hi) {
    UINT_VIEW[0] = hi
    UINT_VIEW[1] = lo
    return DOUBLE_VIEW[0]
  }
  module.exports.pack = toDoubleLE
  function lowUintLE(n) {
    DOUBLE_VIEW[0] = n
    return UINT_VIEW[0]
  }
  module.exports.lo = lowUintLE
  function highUintLE(n) {
    DOUBLE_VIEW[0] = n
    return UINT_VIEW[1]
  }
  module.exports.hi = highUintLE
} else {
  //Use big endian
  module.exports = function doubleBitsBE(n) {
    DOUBLE_VIEW[0] = n
    return [ UINT_VIEW[1], UINT_VIEW[0] ]
  }
  function toDoubleBE(lo, hi) {
    UINT_VIEW[0] = lo
    UINT_VIEW[1] = hi
    return DOUBLE_VIEW[0]
  }
  module.exports.pack = toDoubleBE
  function lowUintBE(n) {
    DOUBLE_VIEW[0] = n
    return UINT_VIEW[1]
  }
  module.exports.lo = lowUintBE
  function highUintBE(n) {
    DOUBLE_VIEW[0] = n
    return UINT_VIEW[0]
  }
  module.exports.hi = highUintBE
}

module.exports.sign = function(n) {
  return module.exports.hi(n) >>> 31
}

module.exports.exponent = function(n) {
  var b = module.exports.hi(n)
  return ((b<<1) >>> 21) - 1023
}

module.exports.fraction = function(n) {
  var lo = module.exports.lo(n)
  var hi = module.exports.hi(n)
  var b = hi & ((1<<20) - 1)
  if(hi & 0x7ff00000) {
    b += (1<<20)
  }
  return [lo, b]
}