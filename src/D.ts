export type T_SIDE = "t" | "r" | "b" | "l";
export type T_LOCK = { t?: boolean; r?: boolean; b?: boolean; l?: boolean };
export type T = {
  i: number;
  t: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  l: T_LOCK;
  c: { t: number[]; r: number[]; b: number[]; l: number[] };
  bp: ("sm" | "lg")[];
  d?: { x: number; y: number };
  aR?: number;
  aB?: number;
  tX?: number;
  tY?: number;
  oW?: number;
  oH?: number;
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
  tempL?: T_LOCK;
  deleted?: boolean;
};

export default [
  //
  // MD,LG 9 Unit Grid
  //
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
    bp: ["md", "lg"],
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
    bp: ["md", "lg"],
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
    bp: ["md", "lg"],
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
    bp: ["md", "lg"],
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
    bp: ["md", "lg"],
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
    bp: ["md", "lg"],
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
    bp: ["md", "lg"],
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
    bp: ["md", "lg"],
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
    bp: ["md", "lg"],
  },
  //
  // SM 4 Unit Grid
  //
  {
    i: 9,
    t: "s",
    x: 0,
    y: 0,
    w: 50,
    h: 50,
    z: 1,
    l: { t: true, l: true },
    c: { t: [], r: [10, 12], b: [11, 12], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["sm"],
  },
  {
    i: 10,
    t: "s",
    x: 50,
    y: 0,
    w: 50,
    h: 50,
    z: 2,
    l: { t: true, r: true },
    c: { t: [], r: [], b: [11, 12], l: [9, 11] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["sm"],
  },
  {
    i: 11,
    t: "s",
    x: 0,
    y: 50,
    w: 50,
    h: 50,
    z: 3,
    l: { l: true, b: true },
    c: { t: [9, 10], r: [10, 12], b: [], l: [] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["sm"],
  },
  {
    i: 12,
    t: "s",
    x: 50,
    y: 50,
    w: 50,
    h: 50,
    z: 4,
    l: { b: true, r: true },
    c: { t: [9, 10], r: [], b: [], l: [9, 11] },
    minW: 10,
    maxW: 100,
    minH: 10,
    maxH: 100,
    bp: ["sm"],
  },
] as T[];
