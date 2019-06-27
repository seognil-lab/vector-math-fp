import {
    add,
    curry,
    divide,
    map,
    multiply,
    pipe,
    subtract,
    sum,
    zipWith,
    mergeWith,
    cloneDeep,
} from 'lodash/fp';

import approxFix from 'approx-fix';

// e.g.:
// Vmath(divide)(v1)(v2) => v2 / 1v
// Vrotate(angle)(v) => v ~
// Vmath(divide)([1, 2])([4, 6]) => [4, 3]

// * -------------------------------- tools

// * support Array and Object
const Vmath = curry((fn, v2, v1) =>
    Array.isArray(v1) ? zipWith(fn, v1, v2) : mergeWith(fn, cloneDeep(v1), v2),
);

const VarrToObj = curry((keys, arr) =>
    keys.reduce((o, k, i) => Object.assign(o, { [k]: arr[i] || 0 }), {}),
);
const VobjToArr = curry((keys, obj) => keys.map(k => obj[k] || 0));
const VradianToDegree = n => (n * 180) / Math.PI;
const VdegreeToRadian = n => (n / 180) * Math.PI;
const VformatAngle = angle =>
    Math.abs(angle % 360) === 180 ? 180 : (((angle % 360) + 540) % 360) - 180;

// * ---------------- simple math

const Vminus = Vmath(subtract);
const Vadd = Vmath(add);
const Vtimes = Vmath(multiply);
const Vdivide = Vmath(divide);
const Vdot = curry((v1, v2) => v1[0] * v2[0] + v1[1] * v2[1]); // === * cos(tha)
const Vcross = curry((v1, v2) => v1[0] * v2[1] - v2[0] * v1[1]); // === * sin(tha)

// * ---------------- vector property

const VlenOf = pipe([map(e => e ** 2), sum, Math.sqrt]);
const VareaOf = v => multiply(...v);
const VratioOf = ([x, y]) => (!y ? NaN : x / y); // 16:9 => 16 / 9

// * -------------------------------- rotate and angle

const VangleBetween = curry((v1, v2) => {
    const s = VlenOf(v1) * VlenOf(v2);
    if (s === 0) return 0;

    let r = Vdot(v1, v2) / s;
    r = Math.min(r, 1);
    return approxFix(VradianToDegree(Math.acos(r) * (Vcross(v1, v2) < 0 ? -1 : 1)));
});

const VangleOf = VangleBetween([1, 0]);

const VvectorCase = {
    '-90': [0, -1],
    0: [1, 0],
    90: [0, 1],
    180: [-1, 0],
};

const VvectorOf = angle => {
    const normalAngle = VformatAngle(angle);
    if (VvectorCase[normalAngle]) return VvectorCase[normalAngle];

    const radian = VdegreeToRadian(normalAngle);
    return [Math.cos(radian), Math.sin(radian)];
};

const VrotateRaw = (angle, v) => {
    const c = VlenOf(v);
    if (c === 0) return v;

    const radian = VdegreeToRadian(angle);
    const cos1 = v[0] / c;
    const sin1 = v[1] / c;
    const cos2 = Math.cos(radian);
    const sin2 = Math.sin(radian);
    return [(cos1 * cos2 - sin1 * sin2) * c, (sin1 * cos2 + cos1 * sin2) * c].map(approxFix);
};
const Vrotate = curry(VrotateRaw);
const VunRotate = curry((angle, v) => VrotateRaw(-angle, v));

// * -------------------------------- export

export {
    Vmath as math,
    VarrToObj as arrToObj,
    VobjToArr as objToArr,
    VradianToDegree as radianToDegree,
    VdegreeToRadian as degreeToRadian,
    VformatAngle as formatAngle,
    Vminus as minus,
    Vadd as add,
    Vtimes as times,
    Vdivide as divide,
    Vdot as dot,
    Vcross as cross,
    VlenOf as lenOf,
    VareaOf as areaOf,
    VratioOf as ratioOf,
    VangleBetween as angleBetween,
    VangleOf as angleOf,
    VvectorOf as vectorOf,
    Vrotate as rotate,
    VunRotate as unRotate,
};
