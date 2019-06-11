import { curry, zipWith, mergeWith, cloneDeep, subtract, add, multiply, divide, pipe, map, sum } from 'lodash/fp';
import approxFix from 'approx-fix';

// e.g.:
// _math(divide)(v1)(v2) => v2 / 1v
// _rotate(angle)(v) => v ~
// _math(divide)([1, 2])([4, 6]) => [4, 3]

// * -------------------------------- tools

// * support Array and Object
const _math = curry((fn, v2, v1) =>
    Array.isArray(v1) ? zipWith(fn, v1, v2) : mergeWith(fn, cloneDeep(v1), v2),
);

const _arrToObj = curry((keys, arr) => keys.reduce((o, k, i) => ((o[k] = arr[i] || 0), o), {}));
const _objToArr = curry((keys, obj) => keys.map(k => obj[k] || 0));
const _radianToDegree = n => (n * 180) / Math.PI;
const _degreeToRadian = n => (n / 180) * Math.PI;
const _formatAngle = angle =>
    Math.abs(angle % 360) == 180 ? 180 : (((angle % 360) + 540) % 360) - 180;

// * ---------------- simple math

const _minus = _math(subtract);
const _add = _math(add);
const _times = _math(multiply);
const _divide = _math(divide);
const _dot = curry((v1, v2) => v1[0] * v2[0] + v1[1] * v2[1]); // == * cos(tha)
const _cross = curry((v1, v2) => v1[0] * v2[1] - v2[0] * v1[1]); // == * sin(tha)

// * ---------------- vector property

const _lenOf = pipe([map(e => Math.pow(e, 2)), sum, Math.sqrt]);
const _areaOf = v => multiply(...v);
const _ratioOf = ([x, y]) => (!y ? NaN : x / y); // 16:9 => 16 / 9

// * -------------------------------- rotate and angle

const _angleBetween = curry((v1, v2) => {
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
const _rotate = curry(_rotateRaw);
const _unRotate = curry((angle, v) => _rotateRaw(-angle, v));

export { _add as add, _angleBetween as angleBetween, _angleOf as angleOf, _areaOf as areaOf, _arrToObj as arrToObj, _cross as cross, _degreeToRadian as degreeToRadian, _divide as divide, _dot as dot, _formatAngle as formatAngle, _lenOf as lenOf, _math as math, _minus as minus, _objToArr as objToArr, _radianToDegree as radianToDegree, _ratioOf as ratioOf, _rotate as rotate, _times as times, _unRotate as unRotate, _vectorOf as vectorOf };
