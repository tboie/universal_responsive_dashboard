# UNIVERSAL RESPONSIVE DASHBOARD

## Goals

Create a browser GUI template system with the following features:

- moveable,
- sizeable,
- touchable,
- connected,
- lockable sides
- template width breakpoints
- grid scale 0-100

## Demo

<img width="480" alt="concept" src="https://user-images.githubusercontent.com/26150152/179244802-826ec5b1-a7f7-49de-a2be-e8d8c73ef62e.png">

<img width="300" alt="unit" src="https://user-images.githubusercontent.com/26150152/179247744-40f889f2-bf93-4eba-8968-69e852182b3c.png">

![output](https://user-images.githubusercontent.com/26150152/179244422-b0102d1c-71d1-45a0-ab13-ca630db95ab6.gif)

![cascading](https://user-images.githubusercontent.com/26150152/179254478-38b39839-03a6-4285-9dec-1933d1cf2cd9.png)

## Demo

[Universal Responsive Dashboard Demo](https://unidashboard.vercel.app/)

## Install/Run

```
npm i
npm start
```

## Template Width Breakpoints

- (sm, md, lg) are set in [src/A.css](https://github.com/tboie/universal_responsive_dashboard/blob/main/src/A.css)

## Template Unit Configuration

- Template file in [src/D.ts](https://github.com/tboie/universal_responsive_dashboard/blob/main/src/D.ts)
- The Core Absolute Unit Component has the following properties:

```typescript
export type T = {
  i: number; // index
  t: string; // component type
  x: number; // position x
  y: number; // position y
  w: number; // width
  h: number; // height
  z: number; // z index
  l: T_LOCK; // side locks obj. ex) { t: true, r: false, ... }
  // connected unit index to sides. ex) { t: [1], r: [2, 3], ...}
  c: { t: number[]; r: number[]; b: number[]; l: number[] };
  bp: ("sm" | "md" | "lg")[]; // width breakpoint template class name
  minW: number; // minimum width
  maxW: number; // maximum height
  minH: number; // minimum height
  maxH: number; // maximum height

  // automatically set...
  d?: { x: number; y: number }; // distance moved
  aR?: number; // anchor right
  aB?: number; // anchor bottom
  tX?: number; // translate x
  tY?: number; // translate y
  oX?: number; // original x
  oY?: number; // original y
  oW?: number; // original width
  oH?: number; // origianl height
  tempL?: T_LOCK; // temporary locks
  deleted?: boolean; // deleted
};
```
