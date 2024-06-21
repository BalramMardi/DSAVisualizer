import React, { useState, useEffect } from "react";
import Node from "./Node/Node";
import { dijkstra } from "../algorithms/dijkstra";
import { AStar } from "../algorithms/aStar";
import { dfs } from "../algorithms/dfs";
import { bfs } from "../algorithms/bfs";

import "./PathfindingVisualizer.css";

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const PathfindingVisualizer = () => {
  const { width, height } = useWindowDimensions();

  const no_of_col = (width / 1536) * 35;
  const initialFinish_node = (width / 1536) * 15;

  const [grid, setGrid] = useState([]);
  const [START_NODE_ROW, setStartNodeRow] = useState(5);
  const [FINISH_NODE_ROW, setFinishNodeRow] = useState(5);
  const [START_NODE_COL, setStartNodeCol] = useState(5);
  const [FINISH_NODE_COL, setFinishNodeCol] = useState(7);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [ROW_COUNT, setRowCount] = useState(20);
  const [COLUMN_COUNT, setColumnCount] = useState(no_of_col);
  const [MOBILE_ROW_COUNT, setMobileRowCount] = useState(10);
  const [MOBILE_COLUMN_COUNT, setMobileColumnCount] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [isStartNode, setIsStartNode] = useState(false);
  const [isFinishNode, setIsFinishNode] = useState(false);
  const [isWallNode, setIsWallNode] = useState(false);
  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);
  const [isDesktopView, setIsDesktopView] = useState(true);

  useEffect(() => {
    setColumnCount(no_of_col);
  }, [no_of_col]);

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, [COLUMN_COUNT]);

  const toggleIsRunning = () => {
    setIsRunning(!isRunning);
  };

  const toggleView = () => {
    if (!isRunning) {
      clearGrid();
      clearWalls();
      const isDesktop = !isDesktopView;
      let newGrid;
      if (isDesktop) {
        newGrid = getInitialGrid(ROW_COUNT, COLUMN_COUNT);
      } else {
        if (
          START_NODE_ROW > MOBILE_ROW_COUNT ||
          FINISH_NODE_ROW > MOBILE_ROW_COUNT ||
          START_NODE_COL > MOBILE_COLUMN_COUNT ||
          FINISH_NODE_COL > MOBILE_COLUMN_COUNT
        ) {
          alert("Start & Finish Nodes Must Be within 10 Rows x 20 Columns");
        } else {
          newGrid = getInitialGrid(MOBILE_ROW_COUNT, MOBILE_COLUMN_COUNT);
        }
      }
      setIsDesktopView(isDesktop);
      setGrid(newGrid);
    }
  };

  const getInitialGrid = (rowCount = ROW_COUNT, colCount = COLUMN_COUNT) => {
    const initialGrid = [];
    for (let row = 0; row < rowCount; row++) {
      const currentRow = [];
      for (let col = 0; col < colCount; col++) {
        currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  };

  const createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      distanceToFinishNode:
        Math.abs(FINISH_NODE_ROW - row) + Math.abs(FINISH_NODE_COL - col),
      isVisited: false,
      isWall: false,
      previousNode: null,
      isNode: true,
    };
  };

  const handleMouseDown = (row, col) => {
    if (!isRunning) {
      if (isGridClear()) {
        if (
          document.getElementById(`node-${row}-${col}`).className ===
          "node node-start"
        ) {
          setMouseIsPressed(true);
          setIsStartNode(true);
          setCurrRow(row);
          setCurrCol(col);
        } else if (
          document.getElementById(`node-${row}-${col}`).className ===
          "node node-finish"
        ) {
          setMouseIsPressed(true);
          setIsFinishNode(true);
          setCurrRow(row);
          setCurrCol(col);
        } else {
          const newGrid = getNewGridWithWallToggled(grid, row, col);
          setGrid(newGrid);
          setMouseIsPressed(true);
          setIsWallNode(true);
          setCurrRow(row);
          setCurrCol(col);
        }
      } else {
        clearGrid();
      }
    }
  };

  const isGridClear = () => {
    for (const row of grid) {
      for (const node of row) {
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`
        ).className;
        if (
          nodeClassName === "node node-visited" ||
          nodeClassName === "node node-shortest-path"
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleMouseEnter = (row, col) => {
    if (!isRunning) {
      if (mouseIsPressed) {
        const nodeClassName = document.getElementById(
          `node-${row}-${col}`
        ).className;
        if (isStartNode) {
          if (nodeClassName !== "node node-wall") {
            const prevStartNode = grid[currRow][currCol];
            prevStartNode.isStart = false;
            document.getElementById(`node-${currRow}-${currCol}`).className =
              "node";

            setCurrRow(row);
            setCurrCol(col);
            const currStartNode = grid[row][col];
            currStartNode.isStart = true;
            document.getElementById(`node-${row}-${col}`).className =
              "node node-start";
          }
          setStartNodeRow(row);
          setStartNodeCol(col);
        } else if (isFinishNode) {
          if (nodeClassName !== "node node-wall") {
            const prevFinishNode = grid[currRow][currCol];
            prevFinishNode.isFinish = false;
            document.getElementById(`node-${currRow}-${currCol}`).className =
              "node";

            setCurrRow(row);
            setCurrCol(col);
            const currFinishNode = grid[row][col];
            currFinishNode.isFinish = true;
            document.getElementById(`node-${row}-${col}`).className =
              "node node-finish";
          }
          setFinishNodeRow(row);
          setFinishNodeCol(col);
        } else if (isWallNode) {
          const newGrid = getNewGridWithWallToggled(grid, row, col);
          setGrid(newGrid);
        }
      }
    }
  };

  const handleMouseUp = (row, col) => {
    if (!isRunning) {
      setMouseIsPressed(false);
      if (isStartNode) {
        setIsStartNode(false);
        setStartNodeRow(row);
        setStartNodeCol(col);
      } else if (isFinishNode) {
        setIsFinishNode(false);
        setFinishNodeRow(row);
        setFinishNodeCol(col);
      }
      getInitialGrid();
    }
  };

  const handleMouseLeave = () => {
    if (isStartNode) {
      setIsStartNode(false);
      setMouseIsPressed(false);
    } else if (isFinishNode) {
      setIsFinishNode(false);
      setMouseIsPressed(false);
    } else if (isWallNode) {
      setIsWallNode(false);
      setMouseIsPressed(false);
      getInitialGrid();
    }
  };

  const clearGrid = () => {
    if (!isRunning) {
      const newGrid = grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (
            nodeClassName !== "node node-start" &&
            nodeClassName !== "node node-finish" &&
            nodeClassName !== "node node-wall"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(FINISH_NODE_ROW - node.row) +
              Math.abs(FINISH_NODE_COL - node.col);
          }
          if (nodeClassName === "node node-finish") {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode = 0;
          }
          if (nodeClassName === "node node-start") {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(FINISH_NODE_ROW - node.row) +
              Math.abs(FINISH_NODE_COL - node.col);
            node.isStart = true;
            node.isWall = false;
            node.previousNode = null;
            node.isNode = true;
          }
        }
      }
    }
  };

  const clearWalls = () => {
    if (!isRunning) {
      const newGrid = grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (nodeClassName === "node node-wall") {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
            node.isWall = false;
          }
        }
      }
    }
  };

  const visualize = (algo) => {
    if (!isRunning) {
      clearGrid();
      toggleIsRunning();
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      let visitedNodesInOrder;
      switch (algo) {
        case "Dijkstra":
          visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
          break;
        case "AStar":
          visitedNodesInOrder = AStar(grid, startNode, finishNode);
          break;
        case "BFS":
          visitedNodesInOrder = bfs(grid, startNode, finishNode);
          break;
        case "DFS":
          visitedNodesInOrder = dfs(grid, startNode, finishNode);
          break;
        default:
          // should never get here
          break;
      }
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      nodesInShortestPathOrder.push("end");
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  };

  const animate = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`
        ).className;
        if (
          nodeClassName !== "node node-start" &&
          nodeClassName !== "node node-finish"
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (nodesInShortestPathOrder[i] === "end") {
        setTimeout(() => {
          toggleIsRunning();
        }, i * 50);
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (
            nodeClassName !== "node node-start" &&
            nodeClassName !== "node node-finish"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-shortest-path";
          }
        }, i * 40);
      }
    }
  };

  return (
    <div>
      <table className="grid-container" onMouseLeave={() => handleMouseLeave()}>
        <tbody className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                      onMouseUp={() => handleMouseUp(row, col)}
                      row={row}
                    ></Node>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="path-bottom-btn">
        <button
          type="button"
          className="btn btn-danger path-btn"
          onClick={() => clearGrid()}
        >
          Clear Grid
        </button>
        <button
          type="button"
          className="btn btn-warning path-btn"
          onClick={() => clearWalls()}
        >
          Clear Walls
        </button>
        <button
          type="button"
          className="btn btn-primary path-btn"
          onClick={() => visualize("Dijkstra")}
        >
          Dijkstra's
        </button>
        <button
          type="button"
          className="btn btn-primary path-btn"
          onClick={() => visualize("AStar")}
        >
          A*
        </button>
        <button
          type="button"
          className="btn btn-primary path-btn"
          onClick={() => visualize("BFS")}
        >
          Bread First Search
        </button>
        <button
          type="button"
          className="btn btn-primary path-btn"
          onClick={() => visualize("DFS")}
        >
          Depth First Search
        </button>
        {isDesktopView ? (
          <button
            type="button"
            className="btn btn-light path-btn"
            onClick={() => toggleView()}
          >
            Mobile View
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-dark path-btn"
            onClick={() => toggleView()}
          >
            Desktop View
          </button>
        )}
      </div>
    </div>
  );
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (!node.isStart && !node.isFinish && node.isNode) {
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
  }
  return newGrid;
};

function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

export default PathfindingVisualizer;
