'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fp = require('lodash/fp');
var approxFix = _interopDefault(require('approx-fix'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

// Vmath(divide)(v1)(v2) => v2 / 1v
// Vrotate(angle)(v) => v ~
// Vmath(divide)([1, 2])([4, 6]) => [4, 3]
// * -------------------------------- tools
// * support Array and Object

var Vmath = fp.curry(function (fn, v2, v1) {
  return Array.isArray(v1) ? fp.zipWith(fn, v1, v2) : fp.mergeWith(fn, fp.cloneDeep(v1), v2);
});
var VarrToObj = fp.curry(function (keys, arr) {
  return keys.reduce(function (o, k, i) {
    return Object.assign(o, _defineProperty({}, k, arr[i] || 0));
  }, {});
});
var VobjToArr = fp.curry(function (keys, obj) {
  return keys.map(function (k) {
    return obj[k] || 0;
  });
});

var VradianToDegree = function VradianToDegree(n) {
  return n * 180 / Math.PI;
};

var VdegreeToRadian = function VdegreeToRadian(n) {
  return n / 180 * Math.PI;
};

var VformatAngle = function VformatAngle(angle) {
  return Math.abs(angle % 360) === 180 ? 180 : (angle % 360 + 540) % 360 - 180;
}; // * ---------------- simple math


var Vminus = Vmath(fp.subtract);
var Vadd = Vmath(fp.add);
var Vtimes = Vmath(fp.multiply);
var Vdivide = Vmath(fp.divide);
var Vdot = fp.curry(function (v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}); // === * cos(tha)

var Vcross = fp.curry(function (v1, v2) {
  return v1[0] * v2[1] - v2[0] * v1[1];
}); // === * sin(tha)
// * ---------------- vector property

var VlenOf = fp.pipe([fp.map(function (e) {
  return Math.pow(e, 2);
}), fp.sum, Math.sqrt]);

var VareaOf = function VareaOf(v) {
  return fp.multiply.apply(void 0, _toConsumableArray(v));
};

var VratioOf = function VratioOf(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      x = _ref2[0],
      y = _ref2[1];

  return !y ? NaN : x / y;
}; // 16:9 => 16 / 9
// * -------------------------------- rotate and angle


var VangleBetween = fp.curry(function (v1, v2) {
  var s = VlenOf(v1) * VlenOf(v2);
  if (s === 0) return 0;
  var r = Vdot(v1, v2) / s;
  r = Math.min(r, 1);
  return approxFix(VradianToDegree(Math.acos(r) * (Vcross(v1, v2) < 0 ? -1 : 1)));
});
var VangleOf = VangleBetween([1, 0]);
var VvectorCase = {
  '-90': [0, -1],
  0: [1, 0],
  90: [0, 1],
  180: [-1, 0]
};

var VvectorOf = function VvectorOf(angle) {
  var normalAngle = VformatAngle(angle);
  if (VvectorCase[normalAngle]) return VvectorCase[normalAngle];
  var radian = VdegreeToRadian(normalAngle);
  return [Math.cos(radian), Math.sin(radian)];
};

var VrotateRaw = function VrotateRaw(angle, v) {
  var c = VlenOf(v);
  if (c === 0) return v;
  var radian = VdegreeToRadian(angle);
  var cos1 = v[0] / c;
  var sin1 = v[1] / c;
  var cos2 = Math.cos(radian);
  var sin2 = Math.sin(radian);
  return [(cos1 * cos2 - sin1 * sin2) * c, (sin1 * cos2 + cos1 * sin2) * c].map(approxFix);
};

var Vrotate = fp.curry(VrotateRaw);
var VunRotate = fp.curry(function (angle, v) {
  return VrotateRaw(-angle, v);
}); // * -------------------------------- export

exports.add = Vadd;
exports.angleBetween = VangleBetween;
exports.angleOf = VangleOf;
exports.areaOf = VareaOf;
exports.arrToObj = VarrToObj;
exports.cross = Vcross;
exports.degreeToRadian = VdegreeToRadian;
exports.divide = Vdivide;
exports.dot = Vdot;
exports.formatAngle = VformatAngle;
exports.lenOf = VlenOf;
exports.math = Vmath;
exports.minus = Vminus;
exports.objToArr = VobjToArr;
exports.radianToDegree = VradianToDegree;
exports.ratioOf = VratioOf;
exports.rotate = Vrotate;
exports.times = Vtimes;
exports.unRotate = VunRotate;
exports.vectorOf = VvectorOf;
//# sourceMappingURL=index.js.map
