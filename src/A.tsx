import "./A.css";
import DATA, { T, T_SIDE } from "./D";
import {
  CORNER_SIZE,
  MOVE_UNIT,
  PRESS_UNIT,
  RESIZE_UNIT,
  SET_UNIT_ANCHORS,
  TOGGLE_UNIT_LOCKS,
} from ".";
import { KeyboardComponent } from "./index";

const U = (
  p: T & { remove: (i: number) => void; split: (i: number) => void } & {
    edit: boolean;
    SELECTED: boolean;
    SET_SELECTED_UNIT: (i: number) => void;
    SELECTED_LAYER: number;
    SOLO: boolean;
    LAYER: number;
    INPUT_TYPE: "W/H" | "X/Y";
    SET_NUMPAD: (val: "W" | "H" | "X" | "Y") => void;
  }
) => {
  return (
    <div
      id={p.LAYER === p.SELECTED_LAYER ? `U${p.i}` : undefined}
      className={`U ${p.bp.join(" ")} ${p.SELECTED ? "selected" : ""}`}
      style={{
        transform: `translate(${(p.x * 100) / p.w}%,${(p.y * 100) / p.h}%)`,
        width: `${p.w}%`,
        height: `${p.h}%`,
        zIndex: p.z,
        visibility: p.LAYER === p.SELECTED_LAYER ? "visible" : "hidden",
      }}
      onPointerDown={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        p.SET_SELECTED_UNIT(p.i);
        PRESS_UNIT(DATA[p.SELECTED_LAYER], p.i, ev.currentTarget, ev);
      }}
      onPointerUp={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        if (!p.edit) {
          p.SET_SELECTED_UNIT(-1);
        }
      }}
    >
      {p.t === "keyboard" && <KeyboardComponent />}

      {/*!p.edit && <img className="img-test" src="/logo512.png" alt="" />*/}
      {p.edit && (!p.SOLO || (p.SOLO && p.SELECTED)) && (
        <div className="edit">
          {
            /* corners */
            ["tl", "tr", "bl", "br"].map((c) => (
              <span
                key={c}
                className={`corner ${c}`}
                style={{
                  width: `${CORNER_SIZE * 100}%`,
                  height: `${CORNER_SIZE * 100}%`,
                }}
              ></span>
            ))
          }

          <span className="dim-label">
            {p.INPUT_TYPE === "X/Y" ? "x" : "w"}:
          </span>
          <span className="dim-label" style={{ marginTop: "47px" }}>
            {p.INPUT_TYPE === "X/Y" ? "y" : "h"}:
          </span>

          {
            /* inputs */
            p.INPUT_TYPE === "W/H"
              ? (["W", "H"] as ("W" | "H")[]).map((dim) => (
                  <input
                    id={"INPUT_" + dim}
                    key={dim}
                    className="dimension"
                    type="number"
                    defaultValue={
                      dim === "W"
                        ? DATA[p.SELECTED_LAYER][p.i]?.w.toFixed(3)
                        : DATA[p.SELECTED_LAYER][p.i]?.h.toFixed(3)
                    }
                    onPointerDown={(e) => {
                      //e.stopPropagation();
                      //e.preventDefault();
                      p.SET_NUMPAD(dim);
                      //e.currentTarget.focus();
                      //e.currentTarget.select();
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        const val = parseFloat(e.currentTarget.value);
                        if (val >= 0 && val <= 100) {
                          RESIZE_UNIT(
                            DATA[p.SELECTED_LAYER],
                            p,
                            dim.toLowerCase() as "w" | "h",
                            val
                          );
                        }
                      }
                    }}
                  />
                ))
              : (["X", "Y"] as ("X" | "Y")[]).map((dim) => (
                  <input
                    key={dim}
                    className="dimension"
                    type="number"
                    defaultValue={
                      dim === "X"
                        ? DATA[p.SELECTED_LAYER][p.i]?.x.toFixed(3)
                        : DATA[p.SELECTED_LAYER][p.i]?.y.toFixed(3)
                    }
                    value={
                      dim === "X"
                        ? DATA[p.SELECTED_LAYER][p.i]?.x.toFixed(3)
                        : DATA[p.SELECTED_LAYER][p.i]?.y.toFixed(3)
                    }
                    onPointerDown={(e) => {
                      //e.stopPropagation();
                      //e.preventDefault();
                      p.SET_NUMPAD(dim);
                      //e.currentTarget.focus();
                      //e.currentTarget.select();
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        MOVE_UNIT(
                          DATA[p.SELECTED_LAYER],
                          p.i,
                          dim,
                          parseFloat(e.currentTarget.value)
                        );
                      }
                    }}
                  />
                ))
          }

          {
            /* locks */
            [
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
                    TOGGLE_UNIT_LOCKS(DATA[p.SELECTED_LAYER], p.i, [side]);
                  }}
                  onPointerDown={(ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                  }}
                ></div>
              );
            })
          }
        </div>
      )}
    </div>
  );
};

export default U;
