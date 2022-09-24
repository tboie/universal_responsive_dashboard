import "./A.css";
import { useEffect } from "react";

import { T, T_SIDE } from "./D";
import {
  CORNER_SIZE,
  ADD_RESIZE_OBSERVER,
  REMOVE_RESIZE_OBSERVER,
  PRESS_UNIT,
  RESIZE_UNIT,
  TOGGLE_UNIT_LOCKS,
} from "./index";

const U = (
  p: T & { remove: (i: number) => void; split: (i: number) => void } & {
    edit: boolean;
  }
) => {
  useEffect(() => {
    if (p.edit) {
      ADD_RESIZE_OBSERVER(p.i);
    }
    return () => REMOVE_RESIZE_OBSERVER(p.i);
  }, [p.edit, p.i]);

  return (
    <div
      id={`U${p.i}`}
      className={`U ${p.bp.join(" ")}`}
      style={{
        transform: `translate(${(p.x * 100) / p.w}%,${(p.y * 100) / p.h}%)`,
        width: `${p.w}%`,
        height: `${p.h}%`,
        zIndex: p.z,
      }}
      onPointerDown={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        PRESS_UNIT(p.i, ev.currentTarget, ev);
      }}
    >
      {p.edit && (
        <div className="edit">
          {["tl", "tr", "bl", "br"].map((c) => (
            <span
              key={c}
              className={`corner ${c}`}
              style={{
                width: `${CORNER_SIZE * 100}%`,
                height: `${CORNER_SIZE * 100}%`,
              }}
            ></span>
          ))}

          {(["w", "h"] as ("w" | "h")[]).map((dim) => (
            <input
              key={dim}
              className="dimension"
              type="number"
              onPointerDown={(e) => {
                e.stopPropagation();
                e.currentTarget.focus();
                e.currentTarget.select();
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  const val = parseFloat(e.currentTarget.value);
                  RESIZE_UNIT(p, dim, val);
                }
              }}
            />
          ))}

          <span
            className="split"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              p.split(p.i);
            }}
          >
            SPLT
          </span>
          <span
            className="delete"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              p.remove(p.i);
            }}
          >
            DEL
          </span>
          {[
            { top: 0, left: 0, right: 0 },
            { right: 0, top: 0, bottom: 0 },
            { bottom: 0, right: 0, left: 0 },
            { left: 0, top: 0, bottom: 0 },
          ].map((pos, idx) => {
            const sides = ["t", "r", "b", "l"];
            const side = sides[idx] as T_SIDE;
            return (
              <div
                key={idx}
                className={`lock ${side} ${p.l[side] ? "on" : ""}`}
                style={pos}
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  TOGGLE_UNIT_LOCKS(p.i, [side]);
                }}
                onPointerDown={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                }}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default U;
