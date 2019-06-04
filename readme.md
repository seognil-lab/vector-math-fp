## ⭐️ What

A FP style curried vector calculation lib.
(primarily for css transform rotate resize calculation)

## 📦 Getting Started

**Installation**

```shell
npm install vector-math-fp
# or
yarn add vector-math-fp
```

**Usage**

```javascript
const {
    minus,
    lenOf,
    angleOf,
    rotate,
    // ...
} = require('vector-math-fp');

minus([2, 7])([3, 9]); // => [1, 2]
lenOf([3, 4]); // => 5
angleOf([1, -1]); // => -45
rotate(90, [2, 1]); // => [-1, 2]
```

---

## 💡 Why

It's for [drag-resize-rotate](https://www.npmjs.com/package/drag-resize-rotate) and other canvas positioning calculation.

## 📖 Description

**Rules**

All curried, FP style

Vector means `Array` e.g. `[1, 2]`  
Vector coordinate system is, `[right, down]`, same as **mouseEvent**

Angle means `Number` which valid result is degree in range `(-180, 180]`

-   degree: 180
-   radian: Math.PI

Angle is clockwise, and start from `[1, 0]`, same as **css transform rotate**

Rotate only support 2d vector

**API**

-   **tools**
    -   arrToObj `(['x', 'y'], [1, 2]) => ({ x: 1, y: 2 })`
    -   objToArr `(['x', 'y'], { x: 1, y: 2 }) => ([1, 2])`
    -   radianToDegree `Radian => Degree`
    -   degreeToRadian `Degree => Radian`
    -   formatAngle `Angle => Angle // in range (-180, 180]`
-   **math**
    -   minus `(v1, v2) => v3`
    -   add `(v1, v2) => v3`
    -   times `(v1, v2) => v3`
    -   divide `(v1, v2) => v3`
    -   dot `(v1, v2) => Number // as len * len * cos(tha)`
    -   cross `(v1, v2) => Number // as len * len * sin(tha)`
-   **verctor property**
    -   lenOf `(v) => Number`
    -   areaOf `(v) => Number`
    -   ratioOf `(v) => Number // as (width / height)`
-   **angle and rotate**
    -   angleBetween `(v1, v2) => Angle // from v1 to v2`
    -   angleOf `(v) => Angle // from [1, 0] to v`
    -   vectorOf `Angle => v // lenOf(v) is 1`
    -   rotate `(Angle, v1) => v2`
    -   unRotate `(Angle, v1) => v2 // === rotate(-Angle, v1)`

---

## ⌨️ Contribution

```shell
# git clone and cd into it
git clone https://github.com/seognil-lab/vector-math-fp

# npm command
npm i
npm run test:watch
```

---

## 📜 References

---

## 🕗 TODO
