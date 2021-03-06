export type T_SIDE = "t" | "r" | "b" | "l";
export type T_LOCK = { t?: boolean; r?: boolean; b?: boolean; l?: boolean };
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
  oY?: number; // origianl y
  oW?: number; // original width
  oH?: number; // origianl height
  tempL?: T_LOCK; // temporary locks
  deleted?: boolean; // deleted
};

// 10x10 Grid
/*
const units: T[] = [];
let x = 0,
  y = 0;

for (y = 0; y < 10; y++) {
  for (x = 0; x < 10; x++) {
    // set connections
    let cT: number[] = [];
    let cB: number[] = [];
    let cL: number[] = [];
    let cR: number[] = [];

    //top
    if (y > 0) {
      cT.push(x + y * 10 - 10);

      if (x > 0) {
        cT.push(x - 1 + y * 10 - 10);
      }
      if (x < 9) {
        cT.push(x + 1 + y * 10 - 10);
      }
    }

    //bottom
    if (y < 9) {
      cB.push(x + y * 10 + 10);

      if (x > 0) {
        cB.push(x - 1 + y * 10 + 10);
      }
      if (x < 9) {
        cB.push(x + 1 + y * 10 + 10);
      }
    }

    //right
    if (x < 9) {
      cR.push(x + y * 10 + 1);

      if (y > 0) {
        cR.push(x + y * 10 + 1 - 10);
      }
      if (y < 9) {
        cR.push(x + y * 10 + 1 + 10);
      }
    }

    //left
    if (x > 0) {
      cL.push(x + y * 10 - 1);

      if (y > 0) {
        cL.push(x + y * 10 - 1 - 10);
      }
      if (y < 9) {
        cL.push(x + y * 10 - 1 + 10);
      }
    }

    units.push({
      t: "s",
      x: x * 10,
      y: y * 10,
      w: 10,
      h: 10,
      minW: 5,
      maxW: 25,
      minH: 5,
      maxH: 25,
      z: 0,
      l: {
        t: y === 0 ? 0 : undefined,
        b: y === 9 ? 100 : undefined,
        r: x === 9 ? 100 : undefined,
        l: x === 0 ? 0 : undefined,
      },
      c: { t: cT, r: cR, b: cB, l: cL },
      bp: ["sm", "lg"],
    } as T);
  }
}

export default units;
*/

/*** 
LG
***/

// 9 Unit Grid
/*
export default [
  // top row
  {
    i: 0,
    t: "s",
    x: 0,
    y: 0,
    w: 33.333,
    h: 33.333,
    z: 1,
    l: { t: true, l: true },
    c: { t: [], r: [1, 4], b: [3, 4], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },
  {
    i: 1,
    t: "s",
    x: 33.333,
    y: 0,
    w: 33.333,
    h: 33.333,
    z: 2,
    l: { t: true },
    c: { t: [], r: [2, 5], b: [3, 4, 5], l: [0, 3] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },
  {
    i: 2,
    t: "s",
    x: 66.666,
    y: 0,
    w: 33.333,
    h: 33.333,
    z: 3,
    l: { t: true, r: true },
    c: { t: [], r: [], b: [5, 4], l: [1, 4] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },
  // middle row
  {
    i: 3,
    t: "s",
    x: 0,
    y: 33.333,
    w: 33.333,
    h: 33.333,
    z: 4,
    l: { l: true },
    c: { t: [0, 1], r: [1, 4, 7], b: [6, 7], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },
  {
    i: 4,
    t: "s",
    x: 33.333,
    y: 33.333,
    w: 33.333,
    h: 33.333,
    z: 5,
    l: {},
    c: { t: [0, 1, 2], r: [2, 5, 8], b: [6, 7, 8], l: [0, 3, 6] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },
  {
    i: 5,
    t: "s",
    x: 66.666,
    y: 33.333,
    w: 33.333,
    h: 33.333,
    z: 6,
    l: { r: true },
    c: { t: [1, 2], r: [], b: [7, 8], l: [1, 4, 7] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },
  //bottom row
  {
    i: 6,
    t: "s",
    x: 0,
    y: 66.666,
    w: 33.333,
    h: 33.333,
    z: 7,
    l: { l: true, b: true },
    c: { t: [3, 4], r: [4, 7], b: [], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },
  {
    i: 7,
    t: "s",
    x: 33.333,
    y: 66.666,
    w: 33.333,
    h: 33.333,
    z: 8,
    l: { b: true },
    c: { t: [3, 4, 5], r: [5, 8], b: [], l: [3, 6] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },
  {
    i: 8,
    t: "s",
    x: 66.666,
    y: 66.666,
    w: 33.333,
    h: 33.333,
    z: 9,
    l: { r: true, b: true },
    c: { t: [4, 5], r: [], b: [], l: [4, 7] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["lg"],
  },

  /***
  MD
  ***/
/*
  // MD top row
  {
    i: 9,
    t: "s",
    x: 0,
    y: 0,
    w: 50,
    h: 33.333,
    z: 10,
    l: { t: true, l: true },
    c: { t: [], r: [10, 12], b: [11, 12], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["md"],
  },
  {
    i: 10,
    t: "s",
    x: 50,
    y: 0,
    w: 50,
    h: 33.333,
    z: 11,
    l: { t: true, r: true },
    c: { t: [], r: [], b: [11, 12], l: [9, 11] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["md"],
  },
  // MD middle row
  {
    i: 11,
    t: "s",
    x: 0,
    y: 33.333,
    w: 50,
    h: 33.333,
    z: 12,
    l: { l: true },
    c: { t: [9, 10], r: [10, 12, 14], b: [13, 14], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["md"],
  },
  {
    i: 12,
    t: "s",
    x: 50,
    y: 33.333,
    w: 50,
    h: 33.333,
    z: 13,
    l: { r: true },
    c: { t: [9, 10], r: [], b: [13, 14], l: [9, 11, 13] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["md"],
  },

  // MD bottom row
  {
    i: 13,
    t: "s",
    x: 0,
    y: 66.666,
    w: 50,
    h: 33.333,
    z: 14,
    l: { l: true, b: true },
    c: { t: [11, 12], r: [12, 14], b: [], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["md"],
  },
  {
    i: 14,
    t: "s",
    x: 50,
    y: 66.666,
    w: 50,
    h: 33.333,
    z: 15,
    l: { b: true, r: true },
    c: { t: [11, 12], r: [], b: [], l: [11, 13] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["md"],
  },

  /***
  SM
  ***/

// SM top row
/*
  {
    i: 15,
    t: "s",
    x: 0,
    y: 0,
    w: 100,
    h: 33.333,
    z: 16,
    l: { t: true, l: true, r: true },
    c: { t: [], r: [], b: [16], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["sm"],
  },
  // SM middle row
  {
    i: 16,
    t: "s",
    x: 0,
    y: 33.333,
    w: 100,
    h: 33.333,
    z: 17,
    l: { l: true, r: true },
    c: { t: [15], r: [], b: [17], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["sm"],
  },
  //SM bottom row
  {
    i: 17,
    t: "s",
    x: 0,
    y: 66.666,
    w: 100,
    h: 33.333,
    z: 18,
    l: { l: true, b: true, r: true },
    c: { t: [16], r: [], b: [], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["sm"],
  },
] as T[];
*/

export default [
  // *** 3 UNIT GRID ***
  [
    {
      i: 0,
      t: "s",
      x: 0,
      y: 0,
      w: 33.333,
      h: 100,
      z: 1,
      l: { t: true, l: true, b: true },
      c: { t: [], r: [1], b: [], l: [] },
      minW: 5,
      maxW: 90,
      minH: 5,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 1,
      t: "s",
      x: 33.333,
      y: 0,
      w: 33.333,
      h: 100,
      z: 1,
      l: { t: true, b: true },
      c: { t: [], r: [2], b: [], l: [0] },
      minW: 5,
      maxW: 90,
      minH: 5,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 2,
      t: "s",
      x: 66.666,
      y: 0,
      w: 33.333,
      h: 100,
      z: 1,
      l: { t: true, r: true, b: true },
      c: { t: [], r: [], b: [], l: [1] },
      minW: 5,
      maxW: 90,
      minH: 5,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
  ] as T[],
  // *** 4 GRID UNIT ***
  [
    {
      i: 0,
      t: "s",
      x: 0,
      y: 0,
      w: 50,
      h: 50,
      z: 1,
      l: { t: true, l: true },
      c: { t: [], r: [1, 3], b: [2, 3], l: [] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 1,
      t: "s",
      x: 50,
      y: 0,
      w: 50,
      h: 50,
      z: 2,
      l: { t: true, r: true },
      c: { t: [], r: [], b: [2, 3], l: [0, 2] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 2,
      t: "s",
      x: 0,
      y: 50,
      w: 50,
      h: 50,
      z: 3,
      l: { l: true, b: true },
      c: { t: [0, 1], r: [1, 3], b: [], l: [] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 3,
      t: "s",
      x: 50,
      y: 50,
      w: 50,
      h: 50,
      z: 4,
      l: { b: true, r: true },
      c: { t: [0, 1], r: [], b: [], l: [0, 2] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
  ] as T[],
  /*** 
  // 9 UNIT GRID
  ***/
  [
    // top row
    {
      i: 0,
      t: "s",
      x: 0,
      y: 0,
      w: 33.333,
      h: 33.333,
      z: 1,
      l: { t: true, l: true },
      c: { t: [], r: [1, 4], b: [3, 4], l: [] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 1,
      t: "s",
      x: 33.333,
      y: 0,
      w: 33.333,
      h: 33.333,
      z: 2,
      l: { t: true },
      c: { t: [], r: [2, 5], b: [3, 4, 5], l: [0, 3] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 2,
      t: "s",
      x: 66.666,
      y: 0,
      w: 33.333,
      h: 33.333,
      z: 3,
      l: { t: true, r: true },
      c: { t: [], r: [], b: [5, 4], l: [1, 4] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    // middle row
    {
      i: 3,
      t: "s",
      x: 0,
      y: 33.333,
      w: 33.333,
      h: 33.333,
      z: 4,
      l: { l: true },
      c: { t: [0, 1], r: [1, 4, 7], b: [6, 7], l: [] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 4,
      t: "s",
      x: 33.333,
      y: 33.333,
      w: 33.333,
      h: 33.333,
      z: 5,
      l: {},
      c: { t: [0, 1, 2], r: [2, 5, 8], b: [6, 7, 8], l: [0, 3, 6] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 5,
      t: "s",
      x: 66.666,
      y: 33.333,
      w: 33.333,
      h: 33.333,
      z: 6,
      l: { r: true },
      c: { t: [1, 2], r: [], b: [7, 8], l: [1, 4, 7] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    //bottom row
    {
      i: 6,
      t: "s",
      x: 0,
      y: 66.666,
      w: 33.333,
      h: 33.333,
      z: 7,
      l: { l: true, b: true },
      c: { t: [3, 4], r: [4, 7], b: [], l: [] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 7,
      t: "s",
      x: 33.333,
      y: 66.666,
      w: 33.333,
      h: 33.333,
      z: 8,
      l: { b: true },
      c: { t: [3, 4, 5], r: [5, 8], b: [], l: [3, 6] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 8,
      t: "s",
      x: 66.666,
      y: 66.666,
      w: 33.333,
      h: 33.333,
      z: 9,
      l: { r: true, b: true },
      c: { t: [4, 5], r: [], b: [], l: [4, 7] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
  ] as T[],
  // FUI
  [
    // top row
    {
      i: 0,
      t: "col1",
      x: 0,
      y: 0,
      w: 16,
      h: 75,
      z: 1,
      l: { t: true, b: true, l: true },
      c: { t: [], r: [1], b: [], l: [] },
      minW: 10,
      maxW: 16,
      minH: 75,
      maxH: 75,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 1,
      t: "col2",
      x: 16,
      y: 0,
      w: 16,
      h: 75,
      z: 1,
      l: { t: true, b: true },
      c: { t: [], r: [2], b: [], l: [0] },
      minW: 10,
      maxW: 16,
      minH: 75,
      maxH: 75,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 2,
      t: "console",
      x: 32,
      y: 0,
      w: 68,
      h: 75,
      z: 1,
      l: { t: true, r: true },
      c: { t: [], r: [], b: [4], l: [1] },
      minW: 36,
      maxW: 80,
      minH: 50,
      maxH: 75,
      bp: ["sm", "md", "lg"],
    },
    // bottom row
    {
      i: 3,
      t: "folders",
      x: 0,
      y: 75,
      w: 45,
      h: 25,
      z: 1,
      l: { t: true, b: true, l: true, r: true },
      c: { t: [], r: [], b: [], l: [] },
      minW: 10,
      maxW: 100,
      minH: 10,
      maxH: 100,
      bp: ["sm", "md", "lg"],
    },
    {
      i: 4,
      t: "keyboard",
      x: 45,
      y: 75,
      w: 55,
      h: 25,
      z: 1,
      l: { b: true, r: true },
      c: { t: [2], r: [], b: [], l: [] },
      minW: 55,
      maxW: 75,
      minH: 25,
      maxH: 50,
      bp: ["sm", "md", "lg"],
    },
  ] as T[],
];
