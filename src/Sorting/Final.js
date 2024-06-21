import React, { useState, useEffect } from "react";
import "./Final.css";

const Final = () => {
  const [numBars, setNumBars] = useState(50);
  const [array, setArray] = useState([]);
  const [animationTimeouts, setAnimationTimeouts] = useState([]);

  useEffect(() => {
    generateArray(numBars); // Initial array size
  }, [numBars]);

  const generateArray = (size) => {
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(randomIntFromInterval(5, 500)); // Adjust range as needed
    }
    setArray(newArray);
  };

  const mergeSort = () => {
    const animations = [];
    const sortedArray = mergeSortHelper(
      array.slice(),
      0,
      array.length - 1,
      animations
    );
    MergeanimateSorting(animations);
  };

  const mergeSortHelper = (arr, l, r, animations) => {
    if (l >= r) return arr;
    const mid = Math.floor((l + r) / 2);
    mergeSortHelper(arr, l, mid, animations);
    mergeSortHelper(arr, mid + 1, r, animations);
    return merge(arr, l, mid, r, animations);
  };

  const merge = (arr, l, mid, r, animations) => {
    let i, j, k;
    let leftArray = arr.slice(l, mid + 1);
    let rightArray = arr.slice(mid + 1, r + 1);
    i = 0;
    j = 0;
    k = l;

    while (i < leftArray.length && j < rightArray.length) {
      if (leftArray[i] <= rightArray[j]) {
        animations.push([k, leftArray[i]]);
        arr[k++] = leftArray[i++];
      } else {
        animations.push([k, rightArray[j]]);
        arr[k++] = rightArray[j++];
      }
    }

    while (i < leftArray.length) {
      animations.push([k, leftArray[i]]);
      arr[k++] = leftArray[i++];
    }

    while (j < rightArray.length) {
      animations.push([k, rightArray[j]]);
      arr[k++] = rightArray[j++];
    }

    return arr;
  };

  const MergeanimateSorting = (animations) => {
    const arrayBars = document.getElementsByClassName("array-bar");

    for (let i = 0; i < animations.length; i++) {
      const [barIndex, newHeight] = animations[i];
      const barStyle = arrayBars[barIndex].style;
      const textElement = arrayBars[barIndex].firstChild; // Select the nested text element

      setTimeout(() => {
        barStyle.height = `${newHeight}px`;
        textElement.textContent = newHeight; // Update text content
      }, i * 10); // Adjust speed of animation here
    }
  };

  const selectionSort = () => {
    const animations = [];
    const sortedArray = selectionSortHelper(array.slice(), animations);
    animateSorting(animations);
  };

  const selectionSortHelper = (arr, animations) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
        animations.push([minIndex, arr[minIndex], j, arr[j]]);
      }
      // Swap elements
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
      animations.push([i, arr[i], minIndex, arr[minIndex]]);
    }
    return arr;
  };

  const animateSorting = (animations) => {
    const arrayBars = document.getElementsByClassName("array-bar");

    for (let i = 0; i < animations.length; i++) {
      const [barOneIndex, barOneHeight, barTwoIndex, barTwoHeight] =
        animations[i];

      setTimeout(() => {
        const barOneStyle = arrayBars[barOneIndex].style;
        const barTwoStyle = arrayBars[barTwoIndex].style;
        barOneStyle.height = `${barOneHeight}px`;
        barTwoStyle.height = `${barTwoHeight}px`;
        arrayBars[barOneIndex].firstChild.textContent = barOneHeight;
        arrayBars[barTwoIndex].firstChild.textContent = barTwoHeight;
      }, i * 10); // Adjust speed of animation here
    }
  };

  const bubbleSort = () => {
    const animations = [];
    const sortedArray = bubbleSortHelper(array.slice(), animations);
    animateSorting(animations);
  };

  const bubbleSortHelper = (arr, animations) => {
    const n = arr.length;
    let swapped;
    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          // Swap arr[j] and arr[j + 1]
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;
        }
        animations.push([j, arr[j], j + 1, arr[j + 1]]);
      }
      // If no two elements were swapped in the inner loop, then break
      if (!swapped) break;
    }
    return arr;
  };

  const resetArray = () => {
    generateArray(numBars);
  };

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumBars(value);
  };

  return (
    <div className="sorting-visualizer">
      <div className="array-container">
        {array.map((value, idx) => (
          <div className="array-bar" key={idx} style={{ height: `${value}px` }}>
            <div className="bar-text">{value}</div>
          </div>
        ))}
      </div>
      <div className="slider-container">
        <input
          type="range"
          min="5"
          max="100"
          value={numBars}
          onChange={handleSliderChange}
          className="slider"
        />
        <label>Number of Bars: {numBars}</label>
      </div>
      <div className="button-container">
        <button onClick={mergeSort}>Merge Sort</button>
        <button onClick={selectionSort}>Selection Sort</button>
        <button onClick={bubbleSort}>Bubble Sort</button>

        <button onClick={resetArray}>Generate New Array</button>
      </div>
    </div>
  );
};

export default Final;
