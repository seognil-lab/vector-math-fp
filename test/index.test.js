const { assert } = require('chai');
const { checkEqual, checkEqualApprox } = require('@seognil-lab/chai-helper');

const {
    // math,
    arrToObj,
    objToArr,
    radianToDegree,
    degreeToRadian,
    formatAngle,
    minus,
    add,
    times,
    divide,
    dot,
    cross,
    lenOf,
    areaOf,
    ratioOf,
    angleBetween,
    angleOf,
    vectorOf,
    rotate,
    unRotate,
} = require('../dist/index.cjs');

// * --------------------------------

describe('tools', () => {
    it('arrToObj objToArr', () => {
        checkEqual(arrToObj(['x', 'y'], [2, 3]), { x: 2, y: 3 });
        checkEqual(objToArr(['x', 'y'], { x: 2, y: 3 }), [2, 3]);

        checkEqual(arrToObj(['x', 'y'], [2]), { x: 2, y: 0 });
        checkEqual(objToArr(['x', 'y'], { x: 2 }), [2, 0]);
    });

    it('FP, arrToObj objToArr', () => {
        checkEqual(arrToObj(['x', 'y'])([2, 3]), { x: 2, y: 3 });
        checkEqual(objToArr(['x', 'y'])({ x: 2, y: 3 }), [2, 3]);

        checkEqual(arrToObj(['x', 'y'])([2]), { x: 2, y: 0 });
        checkEqual(objToArr(['x', 'y'])({ x: 2 }), [2, 0]);
    });

    it('radianToDegree degreeToRadian', () => {
        checkEqual(radianToDegree(Math.PI), 180);
        checkEqual(radianToDegree(Math.PI / 4), 45);
        checkEqual(radianToDegree(Math.PI * 4), 720);

        checkEqual(degreeToRadian(720), Math.PI * 4);
        checkEqual(degreeToRadian(180), Math.PI);
        checkEqual(degreeToRadian(45), Math.PI / 4);
    });

    it('formatAngle', () => {
        checkEqual(formatAngle(-180), 180);
        checkEqual(formatAngle(-179), -179);
        checkEqual(formatAngle(0), 0);
        checkEqual(formatAngle(180), 180);
        checkEqual(formatAngle(360), 0);
        checkEqual(formatAngle(719), -1);
        checkEqual(formatAngle(720), 0);
        checkEqual(formatAngle(721), 1);
    });
});

describe('simple math', () => {
    it('minus add times divide', () => {
        checkEqual(minus([2, 7], [3, 9]), [1, 2]);
        checkEqual(add([2, 3], [4, 5]), [6, 8]);
        checkEqual(times([2, 5], [3, 7]), [6, 35]);
        checkEqual(divide([2, 5], [3, 15]), [1.5, 3]);
    });

    it('fp, minus add times divide', () => {
        checkEqual(minus([2, 7])([3, 9]), [1, 2]);
        checkEqual(add([2, 3])([4, 5]), [6, 8]);
        checkEqual(times([2, 5])([3, 7]), [6, 35]);
        checkEqual(divide([2, 5])([3, 15]), [1.5, 3]);
    });
});

describe('verctor property', () => {
    it('lenOf areaOf ratioOf', () => {
        checkEqual(lenOf([3, 4]), 5);
        checkEqual(areaOf([3, 4]), 12);
        checkEqual(ratioOf([16, 9]), 16 / 9);
    });
});

describe('angle', () => {
    it('angleBetween simple', () => {
        checkEqualApprox(angleBetween([1, 1], [2, 2]), 0);

        checkEqualApprox(angleBetween([1, -2], [1, 2]), 126.86989764584402);
        checkEqualApprox(angleBetween([-1, -2], [-1, 2]), -126.86989764584402);

        checkEqualApprox(angleBetween([2, 1], [1, 2]), 36.86989764584404);
        checkEqualApprox(angleBetween([1, 2], [2, 1]), -36.86989764584404);

        checkEqualApprox(angleBetween([2, 1], [-2, 4]), 90);
        checkEqualApprox(angleBetween([2, 1], [2, -4]), -90);

        checkEqualApprox(angleBetween([2, 1], [-4, -2]), 180);

        checkEqualApprox(angleBetween([2, 1], [-4.1, -2]), 179.43829466743227);
        checkEqualApprox(angleBetween([2, 1], [-3.9, -2]), -179.41536947929453);
    });

    it('FP, angleBetween', () => {
        checkEqualApprox(angleBetween([1, 1])([2, 2]), 0);

        checkEqualApprox(angleBetween([1, -2])([1, 2]), 126.86989764584402);
        checkEqualApprox(angleBetween([-1, -2])([-1, 2]), -126.86989764584402);

        checkEqualApprox(angleBetween([2, 1])([1, 2]), 36.86989764584404);
        checkEqualApprox(angleBetween([1, 2])([2, 1]), -36.86989764584404);

        checkEqualApprox(angleBetween([2, 1])([-2, 4]), 90);
        checkEqualApprox(angleBetween([2, 1])([2, -4]), -90);

        checkEqualApprox(angleBetween([2, 1])([-4, -2]), 180);

        checkEqualApprox(angleBetween([2, 1])([-4.1, -2]), 179.43829466743227);
        checkEqualApprox(angleBetween([2, 1])([-3.9, -2]), -179.41536947929453);
    });

    it('angleOf', () => {
        checkEqualApprox(angleOf([1, 1]), 45);
        checkEqualApprox(angleOf([1, -1]), -45);
        checkEqualApprox(angleOf([-1, 1]), 135);
        checkEqualApprox(angleOf([-1, -1]), -135);
    });
});

describe('rotate', () => {
    it('rotate', () => {
        checkEqualApprox(rotate(0, [1, 1]), [1, 1]);

        checkEqualApprox(rotate(126.86989764584402, [1, -2]), [1, 2]);
        checkEqualApprox(rotate(-126.86989764584402, [-1, -2]), [-1, 2]);

        checkEqualApprox(rotate(36.86989764584404, [2, 1]), [1, 2]);
        checkEqualApprox(rotate(-36.86989764584404, [1, 2]), [2, 1]);

        checkEqualApprox(rotate(90, [2, 1]), [-1, 2]);
        checkEqualApprox(rotate(-90, [2, 1]), [1, -2]);

        checkEqualApprox(rotate(180, [2, 1]), [-2, -1]);
    });

    it('unRotate', () => {
        checkEqualApprox(unRotate(0, [1, 1]), [1, 1]);

        checkEqualApprox(unRotate(-126.86989764584402, [1, -2]), [1, 2]);
        checkEqualApprox(unRotate(126.86989764584402, [-1, -2]), [-1, 2]);

        checkEqualApprox(unRotate(-36.86989764584404, [2, 1]), [1, 2]);
        checkEqualApprox(unRotate(36.86989764584404, [1, 2]), [2, 1]);

        checkEqualApprox(unRotate(-90, [2, 1]), [-1, 2]);
        checkEqualApprox(unRotate(90, [2, 1]), [1, -2]);

        checkEqualApprox(unRotate(180, [2, 1]), [-2, -1]);
    });

    it('FP, rotate', () => {
        checkEqualApprox(rotate(0)([1, 1]), [1, 1]);

        checkEqualApprox(rotate(126.86989764584402)([1, -2]), [1, 2]);
        checkEqualApprox(rotate(-126.86989764584402)([-1, -2]), [-1, 2]);

        checkEqualApprox(rotate(36.86989764584404)([2, 1]), [1, 2]);
        checkEqualApprox(rotate(-36.86989764584404)([1, 2]), [2, 1]);

        checkEqualApprox(rotate(90)([2, 1]), [-1, 2]);
        checkEqualApprox(rotate(-90)([2, 1]), [1, -2]);

        checkEqualApprox(rotate(180)([2, 1]), [-2, -1]);
    });

    it('FP, unRotate', () => {
        checkEqualApprox(unRotate(0)([1, 1]), [1, 1]);

        checkEqualApprox(unRotate(-126.86989764584402)([1, -2]), [1, 2]);
        checkEqualApprox(unRotate(126.86989764584402)([-1, -2]), [-1, 2]);

        checkEqualApprox(unRotate(-36.86989764584404)([2, 1]), [1, 2]);
        checkEqualApprox(unRotate(36.86989764584404)([1, 2]), [2, 1]);

        checkEqualApprox(unRotate(-90)([2, 1]), [-1, 2]);
        checkEqualApprox(unRotate(90)([2, 1]), [1, -2]);

        checkEqualApprox(unRotate(180)([2, 1]), [-2, -1]);
    });
});

describe('360 degree batch test, vector rotate/dot/cross', () => {
    const looper = (n, step = 1, start = 0) =>
        Array(n)
            .fill()
            .map((e, i) => i * step + start);

    const vector1 = [1, 0];

    const inOneRange = e => -1 <= e && e <= 1;
    const inAngleRange = angle => -180 < angle && angle <= 180;

    const inVectorRange = arr => arr.every(inOneRange);

    const makeAngleList = (circle, step) =>
        looper(~~((360 / step) * circle), step, -360 * ~~(circle / 2));

    // * 7 round, 30 degree gap
    const angleListMore = makeAngleList(7, 30);
    const vectorListMore = angleListMore.map(vectorOf);

    // * 1 round, 5 degree gap
    const angleListSingle = makeAngleList(1, 5); // [0, 5, 10, ... , 355]
    const vectorListSingle = angleListSingle.map(vectorOf);

    const checkEvery = (arr, fn) => {
        // * If log, it is fine
        // TODO draw the graph, see function curves, write code check that

        const errorIndex = arr.findIndex((...args) => !fn(...args));
        assert(
            errorIndex == -1,
            `
            error index：${errorIndex}s
            error value：${arr[errorIndex]}
            `,
        );
    };

    it('Pre-generated batch data check', () => {
        checkEvery(angleListMore.map(formatAngle), inAngleRange);
        checkEvery(vectorListMore, inVectorRange);

        // checkEvery(angleListSingle, inAngleRange);
        checkEvery(vectorListSingle, inVectorRange);
    });

    it('dot/cross => vector in range [-1, 1]', () => {
        checkEvery(vectorListSingle.map(v2 => dot(vector1, v2)), inOneRange);
        checkEvery(vectorListSingle.map(v2 => cross(vector1, v2)), inOneRange);
        checkEvery(vectorListMore.map(v2 => dot(vector1, v2)), inOneRange);
        checkEvery(vectorListMore.map(v2 => cross(vector1, v2)), inOneRange);
    });

    it('FP, dot/cross => vector in range [-1, 1]', () => {
        checkEvery(vectorListSingle.map(dot(vector1)), inOneRange);
        checkEvery(vectorListSingle.map(cross(vector1)), inOneRange);
        checkEvery(vectorListMore.map(dot(vector1)), inOneRange);
        checkEvery(vectorListMore.map(cross(vector1)), inOneRange);
    });

    it('angleOf => degree in range (-180, 180]', () => {
        checkEvery(vectorListSingle.map(v2 => angleBetween(vector1, v2)), inAngleRange);
        checkEvery(vectorListSingle.map(v2 => angleOf(v2)), inAngleRange);
        checkEvery(vectorListMore.map(v2 => angleBetween(vector1, v2)), inAngleRange);
        checkEvery(vectorListMore.map(v2 => angleOf(v2)), inAngleRange);
    });

    it('FP, angleOf => degree in range (-180, 180]', () => {
        checkEvery(vectorListSingle.map(angleBetween(vector1)), inAngleRange);
        checkEvery(vectorListSingle.map(angleOf), inAngleRange);
        checkEvery(vectorListMore.map(angleBetween(vector1)), inAngleRange);
        checkEvery(vectorListMore.map(angleOf), inAngleRange);
    });

    it('rotate [1, 1] => vector in range [-1, 1]', () => {
        checkEvery(angleListSingle.map(e => rotate(e, vector1)), inVectorRange);
        checkEvery(angleListSingle.map(e => unRotate(e, vector1)), inVectorRange);
        checkEvery(angleListMore.map(e => rotate(e, vector1)), inVectorRange);
        checkEvery(angleListMore.map(e => unRotate(e, vector1)), inVectorRange);
    });

    it('FP, rotate [1, 1] => vector in range [-1, 1]', () => {
        checkEvery(angleListSingle.map(e => rotate(e)(vector1)), inVectorRange);
        checkEvery(angleListSingle.map(e => unRotate(e)(vector1)), inVectorRange);
        checkEvery(angleListMore.map(e => rotate(e)(vector1)), inVectorRange);
        checkEvery(angleListMore.map(e => unRotate(e)(vector1)), inVectorRange);
    });
});
