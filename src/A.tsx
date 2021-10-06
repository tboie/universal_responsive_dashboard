import "./A.css";
import M, { T } from "./M";

// UNIVERSAL RESPONSIVE DASHBOARD DESIGNER - POC v1 (something to work with)
// TODO:
//  1) FIX
//  2) ORGANIZE
//  3) IMPLEMENT SIDE LOCKS

let SELECTED = "";
let POINTER_POS: undefined | { x: number; y: number } = undefined;
let PREV_POINTER_POS: undefined | { x: number; y: number } = undefined;

const GET_POINTER_COORDS = (root: HTMLDivElement, ev: any) => {
  const R = root.getBoundingClientRect();
  return {
    x: R ? (ev.pageX / R.width) * 100 : 0,
    y: R ? (ev.pageY / R.height) * 100 : 0,
  };
};

const GET_DISTANCE = (x1: number, y1: number, x2: number, y2: number) => ({
  x: x1 - x2,
  y: y1 - y2,
});

const SAVE = (i: number, u: T) => Object.assign(M[i], u);

const GET_CONNECTED_UNITS = () => {
  let ret: number[] = [];

  if (SELECTED) {
    ret.push(parseInt(SELECTED));
    const conns = M[parseInt(SELECTED)].c;
    if (conns) {
      for (const [key, value] of Object.entries(conns)) {
        if (value.length) {
          value.forEach((v) => !ret.includes(v) && ret.push(v));
        }
      }
    }
  }
  return ret;
};

const SET_UNIT = (
  i: number,
  t: "RSZ_BR" | "RSZ_TL" | "MOVE",
  u: T,
  dim: "w" | "h",
  d: number,
  a: number,
  ele: HTMLDivElement
) => {
  // bottom & right
  if (t === "RSZ_BR") {
    dim === "w"
      ? (u.tX = (u.x / (u.w += d)) * 100)
      : (u.tY = (u.y / (u.h += d)) * 100);
  }
  // top & left
  else if (t === "RSZ_TL") {
    dim === "w"
      ? (u.x = a - (u.w -= d)) && (u.tX = ((a - u.w) / u.w) * 100)
      : (u.y = a - (u.h -= d)) && (u.tY = ((a - u.h) / u.h) * 100);
  }
  // move
  /*
      else if (
        (d > 0 && !c[dim === "w" ? s1 : s2].length) ||
        (d < 0 && !c[dim === "w" ? s2 : s1].length)
      ) {
        dim === "w" ? (tX = ((x += d) * 100) / w) : (tY = ((y += d) * 100) / h);
      }
      */
  dim === "w" ? (ele.style.width = u.w + "%") : (ele.style.height = u.h + "%");
  ele.style.transform = `translate(${u.tX}%,${u.tY}%)`;
  SAVE(i, u);
};

const MODIFY = () => {
  if (SELECTED) {
    GET_CONNECTED_UNITS().forEach((v) => {
      if (POINTER_POS && PREV_POINTER_POS) {
        const DIST = GET_DISTANCE(
          POINTER_POS.x,
          POINTER_POS.y,
          PREV_POINTER_POS.x,
          PREV_POINTER_POS.y
        );

        const ELE = document.getElementById(v.toString()) as HTMLDivElement;

        // Lols it works???????

        if (ELE) {
          // Moving Left
          if (DIST.x < 0 || DIST.x > 0) {
            // Lock exists on right
            if (typeof M[v].l.r !== "undefined") {
              // No Lock on Left
              if (typeof M[v].l.l === "undefined") {
                // @ts-ignore
                if (M[v].x + M[v].w > M[v].l.r) {
                  SET_UNIT(v, "RSZ_BR", M[v], "w", DIST.x, M[v].aR || 0, ELE);
                } else {
                  SET_UNIT(v, "RSZ_TL", M[v], "w", DIST.x, M[v].aR || 0, ELE);
                }
              }
              // Lock on Left
              else {
                // @ts-ignore
                if (M[v].x > M[v].l.l) {
                  SET_UNIT(v, "RSZ_TL", M[v], "w", DIST.x, M[v].aR || 0, ELE);
                }
                // @ts-ignore
                if (M[v].x + M[v].w > M[v].l.r) {
                  SET_UNIT(v, "RSZ_BR", M[v], "w", DIST.x, M[v].aR || 0, ELE);
                }
              }
            }
            // Lock exists on Left
            else if (typeof M[v].l.l !== "undefined") {
              // @ts-ignore
              if (M[v].x > M[v].l.l) {
                SET_UNIT(v, "RSZ_TL", M[v], "w", DIST.x, M[v].aR || 0, ELE);
              }
              // @ts-ignore
              if (M[v].x + M[v].w > M[v].l.l) {
                SET_UNIT(v, "RSZ_BR", M[v], "w", DIST.x, M[v].aR || 0, ELE);
              }
            }
          }
          // Moving Up
          if (DIST.y < 0 || DIST.y > 0) {
            // Lock exists on Bottom
            if (typeof M[v].l.b !== "undefined") {
              // No Lock on Top
              if (typeof M[v].l.t === "undefined") {
                // @ts-ignore
                if (M[v].y + M[v].h > M[v].l.b) {
                  SET_UNIT(v, "RSZ_BR", M[v], "h", DIST.y, M[v].aB || 0, ELE);
                } else {
                  SET_UNIT(v, "RSZ_TL", M[v], "h", DIST.y, M[v].aB || 0, ELE);
                }
              }
              // Lock on Top
              else {
                // @ts-ignore
                if (M[v].y > M[v].l.t) {
                  SET_UNIT(v, "RSZ_TL", M[v], "h", DIST.y, M[v].aB || 0, ELE);
                }
                // @ts-ignore
                if (M[v].y + M[v].h > M[v].l.b) {
                  SET_UNIT(v, "RSZ_BR", M[v], "h", DIST.y, M[v].aB || 0, ELE);
                }
              }
            }
            // Lock exists on Top
            else if (typeof M[v].l.t !== "undefined") {
              // @ts-ignore
              if (M[v].y > M[v].l.t) {
                SET_UNIT(v, "RSZ_TL", M[v], "h", DIST.y, M[v].aB || 0, ELE);
              }
              // @ts-ignore
              if (M[v].y + M[v].h > M[v].l.t) {
                SET_UNIT(v, "RSZ_BR", M[v], "h", DIST.y, M[v].aB || 0, ELE);
              }
            }
          }
        }
      }
    });
  }
};

// SET ANCHORS AND TRANSLATE VALS TO DATA
const PRESS_UNIT = (ev: React.PointerEvent<HTMLDivElement>, i?: number) => {
  ev.stopPropagation();
  ev.preventDefault();
  if (typeof i !== "undefined") {
    SELECTED = `${i}`;
    GET_CONNECTED_UNITS().forEach((v) => {
      const unit_tX = (M[v].x * 100) / M[v].w;
      const unit_tY = (M[v].y * 100) / M[v].h;
      const unit_aR = (M[v].w * unit_tX) / 100 + M[v].w;
      const unit_aB = (M[v].h * unit_tY) / 100 + M[v].h;

      Object.assign(M[v], { tX: unit_tX });
      Object.assign(M[v], { tY: unit_tY });
      Object.assign(M[v], { aR: unit_aR });
      Object.assign(M[v], { aB: unit_aB });
    });
  }
};

/*
const PRESS_LOCK = (
  ev: React.PointerEvent<HTMLDivElement>,
  u: T,
  s: "t" | "r" | "b" | "l"
) => {
  ev.stopPropagation();
  ev.preventDefault();
  u.l[s]
    ? (u.l[s] = undefined)
    : s === "l" || s === "r"
    ? (u.l[s] = u.x + u.w / 2)
    : (u.l[s] = u.y + u.h / 2);

  ev.currentTarget.style.backgroundColor = u.l[s] ? "lightgray" : "transparent";
  SAVE(u.i || 0, u);
};
*/

window.onload = () => {
  const root = document.getElementById("root") as HTMLDivElement;
  if (root) {
    root.addEventListener("pointermove", (e) => {
      POINTER_POS = GET_POINTER_COORDS(root, e);
      MODIFY();
      PREV_POINTER_POS = GET_POINTER_COORDS(root, e);
    });
    root.addEventListener("pointerup", (e) => {
      SELECTED = "";
    });
    root.addEventListener("pointerleave", (e) => {
      SELECTED = "";
      POINTER_POS = undefined;
      PREV_POINTER_POS = undefined;
    });
  }
};

const A = (p: T) => (
  <div
    id={`${p.i}`}
    className={`A ${p.bp.join(" ")}`}
    style={{
      transform: `translate(${(p.x * 100) / p.w}%,${(p.y * 100) / p.h}%)`,
      width: `${p.w}%`,
      height: `${p.h}%`,
      zIndex: p.z,
    }}
    onPointerDown={(ev) => PRESS_UNIT(ev, p.i)}
  >
    {
      // quickly testing...
      [
        { top: 0, left: 0, right: 0 },
        { right: 0, top: 0, bottom: 0 },
        { bottom: 0, right: 0, left: 0 },
        { left: 0, top: 0, bottom: 0 },
      ].map((pos, idx) => {
        const sides = ["t", "r", "b", "l"];
        const side = sides[idx] as "t" | "r" | "b" | "l";
        return (
          <div
            key={idx}
            className={`lock ${typeof p.l[side] !== "undefined" ? "on" : ""}`}
            style={pos}
            //onPointerDown={(ev) => PRESS_LOCK(ev, p, side)}
          ></div>
        );
      })
    }
  </div>
);

export default A;
