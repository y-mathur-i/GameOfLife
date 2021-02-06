import "./App.css";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import produce from "immer";

const dir = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];
let numCols = 100;
let numRows = 40;
function App() {
  const createArr = () => {
    let arr = new Array(40).fill().map(() => Array(100));
    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 100; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  };
  const [working, setWorking] = useState(false);
  const [grid, setGrid] = useState(createArr());
  const activate = (x, y) => {
    let newGrid = produce(grid, (gridCopy) => {
      gridCopy[x][y] = grid[x][y] === 1 ? 0 : 1;
    });
    setGrid(newGrid);
  };

  const workingRef = useRef();
  workingRef.current = working;
  const transformGrid = useCallback(() => {
    // console.log("ab");
    if (!workingRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < 40; i++) {
          for (let j = 0; j < 100; j++) {
            let count = 0;
            dir.forEach(([x, y]) => {
              const dx = i + x;
              const dy = j + y;
              if (0 <= dx && dx < 40 && 0 <= dy && dy < 100) {
                count += g[dx][dy];
              }
            });
            if (count > 3 || count < 2) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && count === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(transformGrid, 100);
  }, []);

  return (
    <>
      <div className="main">
        <div className="heading">
          <h1> Conway's game of life</h1>
        </div>
        <div className="grid">
          {grid.map((row, r) =>
            row.map((col, c) => {
              return (
                <div
                  className="cell"
                  key={`${r}-${c}`}
                  style={{
                    backgroundColor: grid[r][c] === 1 ? "#20be7c" : undefined,
                  }}
                  onClick={() => activate(r, c)}
                ></div>
              );
            })
          )}
        </div>
        <button
          className="btn"
          onClick={() => {
            setWorking(!working);
            if (!working) {
              workingRef.current = true;
            }
            transformGrid();
          }}
        >
          {working ? "stop" : "Transform"}
        </button>
      </div>
    </>
  );
}

export default App;
