import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import "./index.css";
import U from "./A";
import DATA_SRC, { T, T_SIDE } from "./D";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

// UNIVERSAL RESPONSIVE DASHBOARD DESIGNER - POC v2 (something to work with)

// set original values
const DATA = DATA_SRC;
DATA.forEach((L) =>
  L.forEach((u) => {
    u.oX = u.x;
    u.oY = u.y;
    u.oW = u.w;
    u.oH = u.h;
  })
);
export const CORNER_SIZE = 0.35;
let MODIFY_ALL_UNITS = true;
const POINTER_SNAP_THRESHOLD = 2.5;

let POINTER_MOVE_TYPE: "RSZ" | "MOVE" | undefined = undefined;
let POINTER_POS: undefined | { x: number; y: number } = undefined;
let POINTER_PREV_POS: undefined | { x: number; y: number } = undefined;
let POINTER_PRESS_POS: undefined | { x: number; y: number } = undefined;
let POINTER_SNAP_TRIGGER = false;

let RESIZE_OBSERVERS: ResizeObserver[] = [];
const RESET_RESIZE_OBSERVERS = () => (RESIZE_OBSERVERS = []);

let SELECTED_UNIT = -1;
let SELECTED_CORNER: undefined | "tr" | "tl" | "br" | "bl" = undefined;

const GET_POINTER_COORDS = (root: HTMLDivElement, ev: any) => {
  const R = root.getBoundingClientRect();
  return {
    x: R ? (ev.pageX / R.width) * 100 : 0,
    y: R ? (ev.pageY / R.height) * 100 : 0,
  };
};

const SET_SELECTED_CORNER = (D: T[], i: number) => {
  const BOUNDARY_X = D[i].w * CORNER_SIZE;
  const BOUNDARY_Y = D[i].h * CORNER_SIZE;

  SELECTED_CORNER = undefined;
  if (POINTER_POS) {
    if (POINTER_POS.x < D[i].x + BOUNDARY_X) {
      if (POINTER_POS.y < D[i].y + BOUNDARY_Y) {
        SELECTED_CORNER = "tl";
      } else if (POINTER_POS.y > D[i].y + D[i].h - BOUNDARY_Y) {
        SELECTED_CORNER = "bl";
      }
    } else if (POINTER_POS.x > D[i].x + D[i].w - BOUNDARY_X) {
      if (POINTER_POS.y > D[i].y + D[i].h - BOUNDARY_Y) {
        SELECTED_CORNER = "br";
      } else if (POINTER_POS.y < D[i].y + BOUNDARY_Y) {
        SELECTED_CORNER = "tr";
      }
    }

    if (!SELECTED_CORNER) {
      POINTER_MOVE_TYPE = "MOVE";
    } else {
      POINTER_MOVE_TYPE = "RSZ";
    }
  }
};

export const GET_DISTANCE = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => ({
  x: x1 - x2,
  y: y1 - y2,
});

const SAVE = (D: T[], i: number, u: T) => Object.assign(D[i], u);

const GET_CONNECTED_UNITS = (D: T[], i: number, s?: T_SIDE, r?: boolean) => {
  let units: number[] = [];
  if (s) {
    D[i].c[s].forEach((u) => {
      // right and left direction, not in corner
      if (s === "r" || s === "l") {
        if (!D[i].c.t.includes(u) && !D[i].c.b.includes(u)) {
          units.push(u);
          if (r) {
            units = units.concat(GET_CONNECTED_UNITS(D, u, s, r));
          }
        }
      }
      // top and bottom direction, not in corner
      else if (s === "t" || s === "b") {
        if (!D[i].c.r.includes(u) && !D[i].c.l.includes(u)) {
          units.push(u);
          if (r) {
            units = units.concat(GET_CONNECTED_UNITS(D, u, s, r));
          }
        }
      }
    });
  } else {
    for (const [key, value] of Object.entries(D[i].c)) {
      value.forEach((ii) => {
        if (!units.includes(ii)) {
          units.push(ii);
          if (r) {
            units = units.concat(GET_CONNECTED_UNITS(D, ii, key as T_SIDE, r));
          }
        }
      });
    }
  }
  return units;
};

const SET_UNIT = (
  D: T[],
  i: number,
  t: "RSZ_BR" | "RSZ_TL" | "MOVE",
  u: T,
  dim: "w" | "h",
  d: number,
  a: number
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
  else if (t === "MOVE") {
    dim === "w"
      ? (u.tX = ((u.x += d) * 100) / u.w)
      : (u.tY = ((u.y += d) * 100) / u.h);
  }

  const ele = document.getElementById(`U${i}`) as HTMLElement;
  if (ele) {
    dim === "w"
      ? (ele.style.width = u.w + "%")
      : (ele.style.height = u.h + "%");
    ele.style.transform = `translate(${u.tX}%,${u.tY}%)`;
  }

  SAVE(D, i, u);
  SET_UNIT_ANCHORS(D, i);
};

const SET_UNIT_RESIZE_LOCKS = (
  D: T[],
  i: number,
  corner: "tl" | "tr" | "br" | "bl",
  all?: boolean
) => {
  const oY: "t" | "r" | "b" | "l" = corner[0] === "b" ? "t" : "b";

  // lock seleced unit from opposite Y
  TOGGLE_UNIT_LOCKS(D, i, [oY], true, true);

  if (all) {
    // all left/right units have opposite Y locked
    GET_CONNECTED_UNITS(D, i, "l", true).forEach((u) => {
      TOGGLE_UNIT_LOCKS(D, u, [oY], true, true);
    });
    GET_CONNECTED_UNITS(D, i, "r", true).forEach((u) => {
      TOGGLE_UNIT_LOCKS(D, u, [oY], true, true);
    });

    // all opposite units opposite Y have t/b locked
    GET_CONNECTED_UNITS(D, i, oY, true).forEach((u) => {
      TOGGLE_UNIT_LOCKS(D, u, ["t", "b"], true, true);

      GET_CONNECTED_UNITS(D, u, "l", true).forEach((uu) => {
        TOGGLE_UNIT_LOCKS(D, uu, ["t", "b"], true, true);
      });
      GET_CONNECTED_UNITS(D, u, "r", true).forEach((uu) => {
        TOGGLE_UNIT_LOCKS(D, uu, ["t", "b"], true, true);
      });
    });
  }

  const oX: "t" | "r" | "b" | "l" = corner[1] === "r" ? "l" : "r";

  // lock seleced unit from opposite X
  TOGGLE_UNIT_LOCKS(D, i, [oX], true, true);

  if (all) {
    // all left/right units have opposite X locked
    GET_CONNECTED_UNITS(D, i, "t", true).forEach((u) => {
      TOGGLE_UNIT_LOCKS(D, u, [oX], true, true);
    });
    GET_CONNECTED_UNITS(D, i, "b", true).forEach((u) => {
      TOGGLE_UNIT_LOCKS(D, u, [oX], true, true);
    });

    // all opposite units opposite X have r/l locked
    GET_CONNECTED_UNITS(D, i, oX, true).forEach((u) => {
      TOGGLE_UNIT_LOCKS(D, u, ["l", "r"], true, true);

      GET_CONNECTED_UNITS(D, u, "t", true).forEach((uu) => {
        TOGGLE_UNIT_LOCKS(D, uu, ["l", "r"], true, true);
      });
      GET_CONNECTED_UNITS(D, u, "b", true).forEach((uu) => {
        TOGGLE_UNIT_LOCKS(D, uu, ["l", "r"], true, true);
      });
    });
  }
};

const GET_OPPOSITE_SIDE = (s: T_SIDE) => {
  if (s === "t") {
    return "b";
  } else if (s === "r") {
    return "l";
  } else if (s === "l") {
    return "r";
  } else {
    return "t";
  }
};

const SET_CONNECTIONS = (D: T[], i: number) => {
  D.forEach((u) => {
    if (u.i !== i) {
      // disconnection
      if (GET_CONNECTED_UNITS(D, i).includes(u.i)) {
        if (UNIT_TOUCHES(D[i], D[u.i]).length === 0) {
          (["t", "r", "b", "l"] as T_SIDE[]).forEach((s) => {
            if (D[i].c[s].includes(u.i)) {
              D[i].c[s].splice(D[i].c[s].indexOf(u.i), 1);
            }
            if (D[u.i].c[s].includes(i)) {
              D[u.i].c[s].splice(D[u.i].c[s].indexOf(i), 1);
            }
          });
        }
      }
      // new connection
      else {
        UNIT_TOUCHES(D[i], D[u.i]).forEach((s) => {
          const os = GET_OPPOSITE_SIDE(s);
          D[i].c[s].push(u.i);
          if (!D[u.i].c[os].includes(i)) {
            D[u.i].c[os].push(i);
          }
        });
      }
    }
  });
};

export const RESIZE_UNIT = (
  D: T[],
  u: T,
  dim: "w" | "h",
  val: number,
  anim?: boolean
) => {
  const ele = document.getElementById(`U${u.i}`);
  if (ele && anim) {
    ele.style.transition = "linear 0.25s";
    setTimeout(() => {
      ele.style.transition = "";
    }, 250);
  }
  if (val >= 0 && (dim === "w" ? D[u.i].x : D[u.i].y) + val <= 100) {
    Object.assign(D[u.i], dim === "w" ? { w: val } : { h: val });
    REMOVE_ALL_CONNECTIONS(D, u.i);
    SET_UNIT_ANCHORS(D, u.i);
    SET_UNIT(
      D,
      u.i,
      "RSZ_BR",
      D[u.i],
      dim,
      0,
      (dim === "w" ? u.aR : u.aB) || 0
    );
    SET_CONNECTIONS(D, u.i);
  }
};

const MODIFY = (
  D: T[],
  i: number,
  P_DIST: { x: number; y: number },
  TYPE: "DIST" | "SET" | "LOCKS_ON" | "LOCKS_OFF"
): boolean => {
  const locks = D[i].tempL || {};
  let type: "RSZ_TL" | "RSZ_BR" | "MOVE" | "" = "";
  let DIST = { ...P_DIST };

  // min/max lock toggles
  if (TYPE === "LOCKS_ON" || "LOCKS_OFF") {
    if (D[i].w === D[i].minW || D[i].w === D[i].maxW) {
      if (locks.l && !locks.r) {
        TOGGLE_UNIT_LOCKS(D, i, ["r"], true, TYPE === "LOCKS_ON");

        GET_CONNECTED_UNITS(D, i, "r").forEach((u) => {
          TOGGLE_UNIT_LOCKS(D, u, ["l"], true, TYPE === "LOCKS_ON");
        });
      } else if (!locks.l && locks.r) {
        TOGGLE_UNIT_LOCKS(D, i, ["l"], true, TYPE === "LOCKS_ON");

        GET_CONNECTED_UNITS(D, i, "l").forEach((u) => {
          TOGGLE_UNIT_LOCKS(D, u, ["r"], true, TYPE === "LOCKS_ON");
        });
      }
    }

    if (D[i].h === D[i].minH || D[i].h === D[i].maxH) {
      if (locks.t && !locks.b) {
        TOGGLE_UNIT_LOCKS(D, i, ["b"], true, TYPE === "LOCKS_ON");

        GET_CONNECTED_UNITS(D, i, "b").forEach((u) => {
          TOGGLE_UNIT_LOCKS(D, u, ["t"], true, TYPE === "LOCKS_ON");
        });
      } else if (!locks.t && locks.b) {
        TOGGLE_UNIT_LOCKS(D, i, ["t"], true, TYPE === "LOCKS_ON");

        GET_CONNECTED_UNITS(D, i, "t").forEach((u) => {
          TOGGLE_UNIT_LOCKS(D, u, ["b"], true, TYPE === "LOCKS_ON");
        });
      }
    }
  }

  // Mouse Moving Left/Right
  // Lock on Right, No Lock Left
  if (locks.r && !locks.l) {
    type = "RSZ_TL";

    if (TYPE === "DIST") {
      if (D[i].w - DIST.x > D[i].maxW) {
        DIST.x += D[i].w - DIST.x - D[i].maxW;
      } else if (D[i].w - DIST.x < D[i].minW) {
        DIST.x += D[i].w - DIST.x - D[i].minW;
      } else if (!MODIFY_ALL_UNITS && i === SELECTED_UNIT && DIST.x < 0) {
        D.some((u) => {
          if (!u.deleted) {
            const isTouching = UNIT_TOUCHES(D[i], D[u.i]).includes("l");
            const willTouch = UNIT_TOUCHES(
              { ...D[i], x: D[i].x + DIST.x - POINTER_SNAP_THRESHOLD },
              D[u.i]
            ).includes("l");

            if (!isTouching && willTouch) {
              DIST.x = 0;
              DIST.y = 0;
              const diff = D[u.i].x + D[u.i].w - D[i].x;
              SET_UNIT(D, i, "RSZ_TL", D[i], "w", diff, D[i].aR || 0);
              Object.assign(POINTER_PRESS_POS, POINTER_POS);
              POINTER_SNAP_TRIGGER = true;
              return true;
            }
          }
          return false;
        });
      }

      if (D[i].x + DIST.x < 0) {
        DIST.x -= D[i].x + DIST.x;
      }
    }
  }
  // Lock on Left, No Lock on Right
  else if (locks.l && !locks.r) {
    type = "RSZ_BR";

    if (TYPE === "DIST") {
      if (D[i].w + DIST.x > D[i].maxW) {
        DIST.x -= D[i].w + DIST.x - D[i].maxW;
      } else if (D[i].w + DIST.x < D[i].minW) {
        DIST.x -= D[i].w + DIST.x - D[i].minW;
      } else if (!MODIFY_ALL_UNITS && i === SELECTED_UNIT && DIST.x > 0) {
        D.some((u) => {
          if (!u.deleted) {
            const isTouching = UNIT_TOUCHES(D[i], D[u.i]).includes("r");
            const willTouch = UNIT_TOUCHES(
              {
                ...D[i],
                w: D[i].w + DIST.x + POINTER_SNAP_THRESHOLD,
              },
              D[u.i]
            ).includes("r");

            if (!isTouching && willTouch) {
              DIST.x = 0;
              DIST.y = 0;
              const diff = D[u.i].x - (D[i].x + D[i].w);
              SET_UNIT(D, i, "RSZ_BR", D[i], "w", diff, D[i].aR || 0);
              Object.assign(POINTER_PRESS_POS, POINTER_POS);
              POINTER_SNAP_TRIGGER = true;
              return true;
            }
          }
          return false;
        });
      }

      if (D[i].x + D[i].w + DIST.x > 100) {
        DIST.x += 100 - (D[i].x + D[i].w + DIST.x);
      }
    }
  }
  // No Lock Left or Right
  else if (!locks.l && !locks.r) {
    type = "MOVE";

    if (TYPE === "DIST") {
      if (D[i].x + DIST.x < 0) {
        DIST.x -= D[i].x + DIST.x;
      }
      if (D[i].x + D[i].w + DIST.x > 100) {
        DIST.x += 100 - (D[i].x + D[i].w + DIST.x);
      }
    }
  }

  if (type && TYPE === "SET") {
    SET_UNIT(D, i, type, D[i], "w", DIST.x, D[i].aR || 0);
  }

  type = "";
  // Mouse Moving Up/Down
  // Lock on Bottom, No Lock on Top
  if (locks.b && !locks.t) {
    type = "RSZ_TL";

    if (TYPE === "DIST") {
      if (D[i].h - DIST.y > D[i].maxH) {
        DIST.y += D[i].h - DIST.y - D[i].maxH;
      } else if (D[i].h - DIST.y < D[i].minH) {
        DIST.y += D[i].h - DIST.y - D[i].minH;
      } else if (!MODIFY_ALL_UNITS && i === SELECTED_UNIT && DIST.y < 0) {
        D.some((u) => {
          if (!u.deleted) {
            const isTouching = UNIT_TOUCHES(D[i], D[u.i]).includes("t");
            const willTouch = UNIT_TOUCHES(
              { ...D[i], y: D[i].y + DIST.y - POINTER_SNAP_THRESHOLD },
              D[u.i]
            ).includes("t");

            if (!isTouching && willTouch) {
              DIST.y = 0;
              DIST.x = 0;
              const diff = D[u.i].y + D[u.i].h - D[i].y;
              SET_UNIT(D, i, "RSZ_TL", D[i], "h", diff, D[i].aB || 0);
              Object.assign(POINTER_PRESS_POS, POINTER_POS);
              POINTER_SNAP_TRIGGER = true;
              return true;
            }
          }
          return false;
        });
      }

      if (D[i].y + DIST.y < 0) {
        DIST.y -= D[i].y + DIST.y;
      }
    }
  }
  // Lock on Top, No Lock on Bottonm
  else if (locks.t && !locks.b) {
    type = "RSZ_BR";

    if (TYPE === "DIST") {
      if (D[i].h + DIST.y > D[i].maxH) {
        DIST.y -= D[i].h + DIST.y - D[i].maxH;
      } else if (D[i].h + DIST.y < D[i].minH) {
        DIST.y -= D[i].h + DIST.y - D[i].minH;
      } else if (!MODIFY_ALL_UNITS && i === SELECTED_UNIT && DIST.y > 0) {
        D.some((u) => {
          if (!u.deleted) {
            const isTouching = UNIT_TOUCHES(D[i], D[u.i]).includes("b");
            const willTouch = UNIT_TOUCHES(
              {
                ...D[i],
                h: D[i].h + DIST.y + POINTER_SNAP_THRESHOLD,
              },
              D[u.i]
            ).includes("b");

            if (!isTouching && willTouch) {
              DIST.y = 0;
              DIST.x = 0;
              const diff = D[u.i].y - (D[i].y + D[i].h);
              SET_UNIT(D, i, "RSZ_BR", D[i], "h", diff, D[i].aB || 0);
              Object.assign(POINTER_PRESS_POS, POINTER_POS);
              POINTER_SNAP_TRIGGER = true;
              return true;
            }
          }
          return false;
        });
      }

      if (D[i].y + D[i].h + DIST.y > 100) {
        DIST.y += 100 - (D[i].y + D[i].h + DIST.y);
      }
    }
  }
  // No Lock on Top or Bottom
  else if (!locks.b && !locks.t) {
    type = "MOVE";

    if (TYPE === "DIST") {
      if (D[i].y + DIST.y < 0) {
        DIST.y -= D[i].y + DIST.y;
      }
      if (D[i].y + D[i].h + DIST.y > 100) {
        DIST.y += 100 - (D[i].y + D[i].h + DIST.y);
      }
    }
  }

  if (type && TYPE === "SET") {
    SET_UNIT(D, i, type, D[i], "h", DIST.y, D[i].aB || 0);
  }

  if (TYPE === "DIST") {
    Object.assign(D[i], { d: DIST });

    if (DIST.x !== P_DIST.x || DIST.y !== P_DIST.y) {
      return true;
    }
  }

  return false;
};

// SET UNIT POSITION ANCHORS AND TRANSLATE COORDINATES
export const SET_UNIT_ANCHORS = (D: T[], i: number) => {
  const unit_tX = (D[i].x * 100) / D[i].w;
  const unit_tY = (D[i].y * 100) / D[i].h;
  const unit_aR = (D[i].w * unit_tX) / 100 + D[i].w;
  const unit_aB = (D[i].h * unit_tY) / 100 + D[i].h;

  Object.assign(D[i], { tX: unit_tX });
  Object.assign(D[i], { tY: unit_tY });
  Object.assign(D[i], { aR: unit_aR });
  Object.assign(D[i], { aB: unit_aB });
};

const SET_UNIT_ZINDEX = (D: T[], i: number, pos: number | "top") => {
  if (pos === "top") {
    D.filter((u) => u.i !== i)
      .sort((a, b) => a.z - b.z)
      .forEach((u, idx) => {
        Object.assign(u, { z: idx + 1 });
        const ele = document.getElementById("U" + u.i);
        if (ele) {
          ele.style.zIndex = u.z.toString();
        }
      });
  }
  Object.assign(D[i], { z: pos === "top" ? D.length : pos });
  const ele = document.getElementById("U" + i);
  if (ele) {
    ele.style.zIndex = D[i].z.toString();
  }
};

// UNIT PRESSED
export const PRESS_UNIT = (
  D: T[],
  i: number,
  ele: HTMLElement,
  ev: React.PointerEvent<HTMLDivElement>
) => {
  D.forEach((u, ii) => SET_UNIT_ANCHORS(D, ii));
  D.forEach((u, ii) => (D[ii].tempL = JSON.parse(JSON.stringify(D[ii].l))));

  const root = document.getElementById("UNIT_CONTAINER") as HTMLDivElement;
  if (root) {
    POINTER_PRESS_POS = GET_POINTER_COORDS(root, ev);
    POINTER_POS = { ...POINTER_PRESS_POS };
    SET_SELECTED_CORNER(D, i);

    if (SELECTED_CORNER && POINTER_MOVE_TYPE === "RSZ") {
      SET_UNIT_RESIZE_LOCKS(D, i, SELECTED_CORNER, MODIFY_ALL_UNITS);
    }
  }

  SET_UNIT_ZINDEX(D, i, "top");
  ele.querySelector(".edit")?.classList.add("selected");
  SELECTED_UNIT = i;
};

export const TOGGLE_UNIT_LOCKS = (
  D: T[],
  i: number,
  sides: ("t" | "r" | "b" | "l")[],
  temp?: boolean,
  on?: boolean
) => {
  const lock = temp ? D[i].tempL : D[i].l;
  if (lock) {
    sides.forEach((s) => {
      if ((lock[s] && !on) || on === false) {
        lock[s] = false;
      } else if (on || !lock[s]) {
        lock[s] = true;
      }
      const ele = document.querySelector(`#U${i} .${s}`)?.classList;
      if (ele && !temp) {
        lock[s] ? ele.add("on") : ele.remove("on");
      }
    });
  }
};

const TOGGLE_ALL_LOCKS = (D: T[], on: boolean, ignorePerimeter?: boolean) => {
  D.forEach((u) => {
    let l: T_SIDE[] = ["t", "r", "b", "l"];
    if (ignorePerimeter) {
      Math.floor(u.x) === 0 && l.splice(l.indexOf("l"), 1);
      Math.floor(u.y) === 0 && l.splice(l.indexOf("t"), 1);
      Math.ceil(u.x + u.w) === 100 && l.splice(l.indexOf("r"), 1);
      Math.ceil(u.y + u.h) === 100 && l.splice(l.indexOf("b"), 1);
    }
    TOGGLE_UNIT_LOCKS(D, u.i, l, false, on);
  });
};

const RESET_POINTER = (D: T[]) => {
  D.forEach((u) => {
    Object.assign(D[u.i], { d: undefined });
    TOGGLE_UNIT_LOCKS(D, u.i, ["t", "r", "b", "l"], true, false);
    document.querySelector(`#U${u.i} .edit`)?.classList.remove("selected");
  });
  SELECTED_UNIT = -1;
  SELECTED_CORNER = undefined;
  POINTER_POS = undefined;
  POINTER_PREV_POS = undefined;
  POINTER_PRESS_POS = undefined;
  POINTER_SNAP_TRIGGER = false;
  POINTER_MOVE_TYPE = undefined;
  console.log(D);
};

// unit b touches a
const UNIT_TOUCHES = (a: T, b: T) => {
  let sides: T_SIDE[] = [];

  // has horizontal gap
  if (a.x > b.x + b.w || b.x > a.x + a.w) return [];
  // has vertical gap
  if (a.y > b.y + b.h || b.y > a.y + a.h) return [];

  // TODO: verify
  if (a.x < b.x) {
    sides.push("r");
  }
  if (a.y < b.y) {
    sides.push("b");
  }
  if (b.y < a.y) {
    sides.push("t");
  }
  if (b.x < a.x) {
    sides.push("l");
  }

  return sides;
};

// remove from all other unit connections
const REMOVE_ALL_CONNECTIONS = (D: T[], i: number) => {
  console.log("removing");
  console.log(i);
  console.log(D);
  D[i].c = { t: [], r: [], b: [], l: [] };
  D?.forEach((u) => {
    for (const [key, value] of Object.entries(u.c)) {
      const idx = D[u.i]?.c[key as T_SIDE].indexOf(i);
      if (idx > -1) {
        D[u.i].c[key as T_SIDE].splice(idx, 1);
      }
    }
  });
};

const ADD_RESIZE_OBSERVER = (D: T[], i: number) => {
  // Unit Dimensions Text Resize Observer
  RESIZE_OBSERVERS.push(
    new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          const input = entry.target.querySelectorAll(".dimension");
          if (input.length) {
            (input[0] as HTMLInputElement).value = D[i].w.toFixed(3);
            (input[1] as HTMLInputElement).value = D[i].h.toFixed(3);
          }
        }
      }
    })
  );
  const ele = document.querySelector(`#U${i}`);
  if (ele) {
    RESIZE_OBSERVERS[i].observe(ele);
  }
};

const REMOVE_RESIZE_OBSERVER = (i: number) => {
  const ele = document.getElementById(`#U${i}`);
  if (ele) {
    RESIZE_OBSERVERS[i].disconnect();
    RESIZE_OBSERVERS[i].unobserve(ele);
  }
};

const ADD_UNIT = (D: T[], U: T) => {
  D.push(U);
  SET_CONNECTIONS(D, U.i);
  return D[D.length - 1];
};

// Cuts Unit Width by 1/2, Adds new unit as other 1/2
// Returns new unit
const SPLIT_UNIT = (D: T[], i: number) => {
  REMOVE_ALL_CONNECTIONS(D, i);
  // Reduce width by 1/2
  SET_UNIT(D, i, "RSZ_BR", D[i], "w", (D[i].w / 2) * -1, D[i].aR || 0);
  TOGGLE_UNIT_LOCKS(D, i, ["r"], false, false);
  return ADD_UNIT(D, {
    ...D[i],
    i: D.length,
    t: "s",
    x: D[i].x + D[i].w,
    l: {
      l: false,
      r: Math.ceil(D[i].x + D[i].w * 2) >= 100,
      t: Math.floor(D[i].y) <= 0,
      b: Math.ceil(D[i].y + D[i].h) >= 100,
    },
    c: {
      t: [] as number[],
      r: [] as number[],
      b: [] as number[],
      l: [] as number[],
    },
    bp: D[i].bp,
  });
};

export const MOVE_UNIT = (D: T[], i: number, field: "X" | "Y", val: number) => {
  if (val >= 0 && val <= 100) {
    const UNIT = D[i];
    field === "X" ? (UNIT.x = val) : (UNIT.y = val);

    const ele = document.getElementById(`U${i}`);
    if (ele) {
      ele.style.transition = "linear 0.25s";
      ele.style.transform = `translate(${(UNIT.x * 100) / UNIT.w}%,${
        (UNIT.y * 100) / UNIT.h
      }%)`;

      setTimeout(() => {
        ele.style.transition = "";
      }, 250);

      SET_UNIT_ANCHORS(D, i);
    }
  }
};

export const REMOVE_UNIT = (D: T[], i: number) => {
  REMOVE_ALL_CONNECTIONS(D, i);

  /* for now, it's just removed from dom using state
     and data connections, then a deleted flag is set.
     many functions reference the units by array index.
   */

  D[i].deleted = true;
  //D.splice(i, 1);
};

const RESET_DOM_UNITS = (L: T[]) => {
  // lock border
  TOGGLE_ALL_LOCKS(L, true);
  TOGGLE_ALL_LOCKS(L, false, true);

  L.forEach((u, idx) => {
    const ele = document.getElementById(`U${idx}`);
    if (
      ele &&
      typeof u.oX !== "undefined" &&
      typeof u.oY !== "undefined" &&
      typeof u.oW !== "undefined" &&
      typeof u.oH !== "undefined"
    ) {
      u.x = u.oX;
      u.y = u.oY;
      u.w = u.oW;
      u.h = u.oH;

      ele.style.transition = "linear 0.25s";
      ele.style.transform = `translate(${(u.oX * 100) / u.oW}%,${
        (u.oY * 100) / u.oH
      }%)`;

      ele.style.width = u.oW + "%";
      ele.style.height = u.oH + "%";

      setTimeout(() => {
        ele.style.transition = "";
      }, 250);

      SET_UNIT_ANCHORS(L, idx);
    }
  });
};

const DESIGNER = () => {
  const [EDIT, SET_EDIT] = useState(false);
  const [SOLO, SET_SOLO] = useState(!MODIFY_ALL_UNITS);
  const [SEL_UNIT, SET_SEL_UNIT] = useState(SELECTED_UNIT);
  const [INPUT_TYPE, SET_INPUT_TYPE] = useState<"W/H" | "X/Y">("W/H");
  const [NUMPAD, SET_NUMPAD] = useState<"X" | "Y" | "W" | "H" | undefined>(
    undefined
  );
  const [SELECTED_LAYER, SET_SELECTED_LAYER] = useState(0);
  const [TOTAL_UNITS, SET_TOTAL_UNITS] = useState(DATA.flat().length);

  useEffect(() => {
    const root = document.getElementById("UNIT_CONTAINER") as HTMLDivElement;

    const FUNC_POINTER_MOVE = (e: any) => {
      POINTER_POS = GET_POINTER_COORDS(root, e);

      if (POINTER_PRESS_POS && SELECTED_UNIT > -1) {
        const SNAP_DIST = GET_DISTANCE(
          POINTER_PRESS_POS.x,
          POINTER_PRESS_POS.y,
          POINTER_POS.x,
          POINTER_POS.y
        );

        if (
          (POINTER_SNAP_TRIGGER &&
            (Math.abs(SNAP_DIST.x) >= POINTER_SNAP_THRESHOLD ||
              Math.abs(SNAP_DIST.y) >= POINTER_SNAP_THRESHOLD)) ||
          !POINTER_SNAP_TRIGGER
        ) {
          POINTER_SNAP_TRIGGER = false;

          if (POINTER_PREV_POS) {
            const DIST = GET_DISTANCE(
              POINTER_POS.x,
              POINTER_POS.y,
              POINTER_PREV_POS.x,
              POINTER_PREV_POS.y
            );

            // Use lowest dist x/y when min/max bound hit
            let boundHit = false;
            let UNITS = DATA[SELECTED_LAYER].filter((u) => !u.deleted);

            if (!MODIFY_ALL_UNITS) {
              UNITS = UNITS.filter((u) => u.i === SELECTED_UNIT);
            }

            UNITS.forEach((u) => {
              if (MODIFY(DATA[SELECTED_LAYER], u.i, DIST, "DIST")) {
                boundHit = true;
              }
            });

            if (boundHit) {
              // @ts-ignore
              const DX = UNITS.map((u) => u.d.x);
              // @ts-ignore
              const DY = UNITS.map((u) => u.d.y);

              UNITS.forEach((u) => {
                Object.assign(u, {
                  d: {
                    x: DIST.x > 0 ? Math.min(...DX) : Math.max(...DX),
                    y: DIST.y > 0 ? Math.min(...DY) : Math.max(...DY),
                  },
                });
              });
            }

            UNITS.forEach(
              (u) => u.d && MODIFY(DATA[SELECTED_LAYER], u.i, u.d, "LOCKS_OFF")
            );
            UNITS.forEach(
              (u) => u.d && MODIFY(DATA[SELECTED_LAYER], u.i, u.d, "SET")
            );
            UNITS.forEach(
              (u) => u.d && MODIFY(DATA[SELECTED_LAYER], u.i, u.d, "LOCKS_ON")
            );
          }

          POINTER_PREV_POS = GET_POINTER_COORDS(root, e);
        }
      }
    };

    const FUNC_RESET_POINTER = (e: any) => {
      RESET_POINTER(DATA[SELECTED_LAYER]);
    };

    if (root) {
      root.addEventListener("pointermove", FUNC_POINTER_MOVE);
      root.addEventListener("pointerup", FUNC_RESET_POINTER);
      root.addEventListener("pointerleave", FUNC_RESET_POINTER);
    }

    return () => {
      if (root) {
        root.removeEventListener("pointermove", FUNC_POINTER_MOVE);
        root.removeEventListener("pointerup", FUNC_RESET_POINTER);
        root.removeEventListener("pointerleave", FUNC_RESET_POINTER);
      }
    };
  }, [SELECTED_LAYER]);

  const FUNC_REMOVE = (i: number) => {
    REMOVE_UNIT(DATA[SELECTED_LAYER], i);
    SET_TOTAL_UNITS(TOTAL_UNITS - 1);
  };

  const FUNC_ADD = () => {
    const D = DATA[SELECTED_LAYER];
    ADD_UNIT(D, {
      i: D.length,
      t: "s",
      x: 0,
      y: 0,
      w: 20,
      h: 20,
      minW: 1,
      maxW: 100,
      minH: 1,
      maxH: 100,
      l: {},
      z: D.length,
      c: {
        t: [] as number[],
        r: [] as number[],
        b: [] as number[],
        l: [] as number[],
      },
      bp: ["sm", "md", "lg"],
    });
    SET_SEL_UNIT(D.length - 1);
    SET_SOLO(true);
    MODIFY_ALL_UNITS = false;
    SET_TOTAL_UNITS(TOTAL_UNITS + 1);
  };

  useEffect(() => {
    if (EDIT) {
      RESET_RESIZE_OBSERVERS();
      DATA[SELECTED_LAYER].forEach((u) => {
        ADD_RESIZE_OBSERVER(DATA[SELECTED_LAYER], u.i);
      });
    }
    return () =>
      DATA[SELECTED_LAYER].forEach((u) => {
        REMOVE_RESIZE_OBSERVER(u.i);
      });
  }, [EDIT, SELECTED_LAYER, TOTAL_UNITS]);

  return (
    <>
      {NUMPAD ? (
        <COMP_NUMPAD
          SEL_UNIT={SEL_UNIT}
          ENTER={(val) => {
            const D = DATA[SELECTED_LAYER];
            if (NUMPAD === "X" || NUMPAD === "Y") {
              MOVE_UNIT(D, SEL_UNIT, NUMPAD, val);
            } else if (NUMPAD === "W" || NUMPAD === "H") {
              RESIZE_UNIT(
                D,
                D[SEL_UNIT],
                NUMPAD.toLowerCase() as "w" | "h",
                val,
                true
              );
            }
            SET_NUMPAD(undefined);
          }}
          TYPE={NUMPAD}
        />
      ) : null}
      <div id="UNIT_CONTAINER">
        {DATA.map((L, idx) =>
          L.filter((u) => !u.deleted).map((u) => (
            <U
              key={u.i}
              {...u}
              remove={(i) => FUNC_REMOVE(i)}
              split={(i) => FUNC_ADD()}
              edit={EDIT}
              LAYER={idx}
              SELECTED={SEL_UNIT === u.i}
              SET_SELECTED_UNIT={SET_SEL_UNIT}
              SELECTED_LAYER={SELECTED_LAYER}
              SOLO={SOLO}
              INPUT_TYPE={INPUT_TYPE}
              SET_NUMPAD={SET_NUMPAD}
            />
          ))
        )}
      </div>
      <div id="TOOLBAR">
        {DATA.map((L, idx) => (
          <button
            className={SELECTED_LAYER === idx ? "ON" : ""}
            onClick={() => SET_SELECTED_LAYER(idx)}
          >
            {idx}
          </button>
        ))}
        <button
          className={EDIT ? "ON" : ""}
          onClick={() => {
            if (EDIT && SEL_UNIT > -1) {
              SET_SEL_UNIT(-1);
            }
            SET_EDIT(!EDIT);
          }}
        >
          EDIT
        </button>

        <button
          disabled={!EDIT}
          onClick={() => {
            SET_INPUT_TYPE(INPUT_TYPE === "W/H" ? "X/Y" : "W/H");
          }}
        >
          {INPUT_TYPE}
        </button>

        <button
          className={SOLO ? "ON" : ""}
          onClick={() => {
            MODIFY_ALL_UNITS = !MODIFY_ALL_UNITS;
            SET_SOLO(!MODIFY_ALL_UNITS);
          }}
        >
          SOLO
        </button>

        <button
          onClick={() => {
            RESET_DOM_UNITS(DATA[SELECTED_LAYER]);
          }}
        >
          RESET
        </button>

        <button
          disabled={!EDIT || (!EDIT && SOLO)}
          onClick={() => {
            SOLO
              ? TOGGLE_UNIT_LOCKS(
                  DATA[SELECTED_LAYER],
                  SEL_UNIT,
                  ["t", "r", "b", "l"],
                  false,
                  true
                )
              : TOGGLE_ALL_LOCKS(DATA[SELECTED_LAYER], true);
          }}
        >
          LK
        </button>

        <button
          disabled={!EDIT || (!EDIT && SOLO)}
          onClick={() => {
            SOLO
              ? TOGGLE_UNIT_LOCKS(
                  DATA[SELECTED_LAYER],
                  SEL_UNIT,
                  ["t", "r", "b", "l"],
                  false,
                  false
                )
              : TOGGLE_ALL_LOCKS(DATA[SELECTED_LAYER], false);
          }}
        >
          UNLK
        </button>

        <button
          disabled={!EDIT || (EDIT && SOLO && SEL_UNIT > -1)}
          onClick={() => {
            TOGGLE_ALL_LOCKS(DATA[SELECTED_LAYER], true);
            TOGGLE_ALL_LOCKS(DATA[SELECTED_LAYER], false, true);
          }}
        >
          LK BRDER
        </button>

        <button disabled={!EDIT} onClick={() => FUNC_ADD()}>
          ADD
        </button>

        <button
          disabled={!EDIT && SEL_UNIT < 0}
          onClick={() => FUNC_REMOVE(SEL_UNIT)}
        >
          DEL
        </button>
      </div>
    </>
  );
};

type T_NUMPAD = {
  SEL_UNIT: number;
  TYPE: "X" | "Y" | "W" | "H";
  ENTER: (val: number) => void;
};

const COMP_NUMPAD = ({ SEL_UNIT, TYPE, ENTER }: T_NUMPAD) => {
  const [VAL, SET_VAL] = useState<string>("");

  return (
    <div id="NUMPAD_CONTAINER">
      <div id="NUMPAD">
        <span>{TYPE + ": " + VAL}</span>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "CLR"].map(
          (n, idx) => {
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  SET_VAL(n !== "CLR" ? VAL + n : "");
                }}
              >
                {n}
              </button>
            );
          }
        )}
        <button
          disabled={
            typeof VAL === "undefined" ||
            parseInt(VAL) < 0 ||
            parseInt(VAL) > 100
          }
          id="ENTER"
          onClick={(e) => {
            ENTER(parseInt(VAL));
          }}
        >
          ENTER
        </button>
      </div>
    </div>
  );
};

export const KeyboardComponent = () => {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef<any>();

  const onChange = (input: string) => {
    setInput(input);
    console.log("Input changed", input);
  };

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const onKeyPress = (button: any) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const onChangeInput = (event: any) => {
    const input = event.target.value;
    setInput(input);
    if (keyboard && keyboard.current) keyboard.current.setInput(input);
  };

  return (
    <div style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
      <input
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={onChangeInput}
      />
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        layoutName={layout}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    {/* DESIGNER */ <DESIGNER />}
    {/* PRODUCTION
      <>
        {M.map((d) => (
          <U key={d.i} {...d} />
        ))}
      </>
      */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
