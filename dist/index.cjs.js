'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fp = require('lodash/fp');
var approxFix = _interopDefault(require('approx-fix'));

// e.g.:
// _math(divide)(v1)(v2) => v2 / 1v
// _rotate(angle)(v) => v ~
// _math(divide)([1, 2])([4, 6]) => [4, 3]

// * -------------------------------- tools

// * support Array and Object
const _math = fp.curry((fn, v2, v1) =>
    Array.isArray(v1) ? fp.zipWith(fn, v1, v2) : fp.mergeWith(fn, fp.cloneDeep(v1), v2),
);

const _arrToObj = fp.curry((keys, arr) => keys.reduce((o, k, i) => ((o[k] = arr[i] || 0), o), {}));
const _objToArr = fp.curry((keys, obj) => keys.map(k => obj[k] || 0));
const _radianToDegree = n => (n * 180) / Math.PI;
const _degreeToRadian = n => (n / 180) * Math.PI;
const _formatAngle = angle =>
    Math.abs(angle % 360) == 180 ? 180 : (((angle % 360) + 540) % 360) - 180;

// * ---------------- simple math

const _minus = _math(fp.subtract);
const _add = _math(fp.add);
const _times = _math(fp.multiply);
const _divide = _math(fp.divide);
const _dot = fp.curry((v1, v2) => v1[0] * v2[0] + v1[1] * v2[1]); // == * cos(tha)
const _cross = fp.curry((v1, v2) => v1[0] * v2[1] - v2[0] * v1[1]); // == * sin(tha)

// * ---------------- vector property

const _lenOf = fp.pipe([fp.map(e => Math.pow(e, 2)), fp.sum, Math.sqrt]);
const _areaOf = v => fp.multiply(...v);
const _ratioOf = ([x, y]) => (!y ? NaN : x / y); // 16:9 => 16 / 9

// * -------------------------------- rotate and angle

const _angleBetween = fp.curry((v1, v2) => {
    let s = _lenOf(v1) * _lenOf(v2);
    if (s == 0) return 0;

    let r = _dot(v1, v2) / s;
    r = Math.min(r, 1);
    return approxFix(_radianToDegree(Math.acos(r) * (_cross(v1, v2) < 0 ? -1 : 1)));
});

const _angleOf = _angleBetween([1, 0]);

const _vectorCase = {
    '-90': [0, -1],
    0: [1, 0],
    90: [0, 1],
    180: [-1, 0],
};

const _vectorOf = angle => {
    angle = _formatAngle(angle);
    let radian;
    return (
        _vectorCase[angle] ||
        ((radian = _degreeToRadian(angle)), [Math.cos(radian), Math.sin(radian)])
    );
};

const _rotateRaw = (angle, v) => {
    angle = angle || 0;
    let c = _lenOf(v);
    if (c == 0) return v;

    const radian = _degreeToRadian(angle);
    let cos1 = v[0] / c,
        sin1 = v[1] / c,
        cos2 = Math.cos(radian),
        sin2 = Math.sin(radian);
    return [(cos1 * cos2 - sin1 * sin2) * c, (sin1 * cos2 + cos1 * sin2) * c].map(approxFix);
};
const _rotate = fp.curry(_rotateRaw);
const _unRotate = fp.curry((angle, v) => _rotateRaw(-angle, v));

exports.add = _add;
exports.angleBetween = _angleBetween;
exports.angleOf = _angleOf;
exports.areaOf = _areaOf;
exports.arrToObj = _arrToObj;
exports.cross = _cross;
exports.degreeToRadian = _degreeToRadian;
exports.divide = _divide;
exports.dot = _dot;
exports.formatAngle = _formatAngle;
exports.lenOf = _lenOf;
exports.math = _math;
exports.minus = _minus;
exports.objToArr = _objToArr;
exports.radianToDegree = _radianToDegree;
exports.ratioOf = _ratioOf;
exports.rotate = _rotate;
exports.times = _times;
exports.unRotate = _unRotate;
exports.vectorOf = _vectorOf;
