import React, { useState, useEffect } from 'react';
import './SlidingPuzzle.css';

const SlidingPuzzle = () => {
  const gridSize = 3; 
  const totalTiles = gridSize * gridSize;
  const initialTime = 120; 

  const shuffleArray = (arr) => {
    let shuffledArr;
    do {
      shuffledArr = arr.slice();
      for (let i = shuffledArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
      }
    } while (!isSolvable(shuffledArr));
    return shuffledArr;
  };

  const getInversionCount = (arr) => {
    let inversionCount = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j] && arr[i] !== totalTiles - 1 && arr[j] !== totalTiles - 1) {
          inversionCount++;
        }
      }
    }
    return inversionCount;
  };

  const isSolvable = (tiles) => {
    const inversionCount = getInversionCount(tiles);
    return inversionCount % 2 === 0;
  };

  const [tiles, setTiles] = useState(shuffleArray([...Array(totalTiles).keys()]));
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [gameOver, setGameOver] = useState(false); 

  const isSolved = () => {
    for (let i = 0; i < totalTiles - 1; i++) {
      if (tiles[i] !== i) return false;
    }
    return true;
  };

  const handleTileClick = (index) => {
    if (gameOver) return;
    const emptyIndex = tiles.indexOf(totalTiles - 1);
    const [emptyRow, emptyCol] = [Math.floor(emptyIndex / gridSize), emptyIndex % gridSize];
    const [tileRow, tileCol] = [Math.floor(index / gridSize), index % gridSize];

    const isAdjacent = (Math.abs(emptyRow - tileRow) + Math.abs(emptyCol - tileCol)) === 1;
    if (isAdjacent) {
      const newTiles = tiles.slice();
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
    }
  };

  useEffect(() => {
    if (isSolved()) {
      setShowModal(true);
      setGameOver(true); 
    }
  }, [tiles]);

 
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setGameOver(true); 
      setShowModal(true);
    }
  }, [timeLeft, gameOver]);

  const resetPuzzle = () => {
    setTiles(shuffleArray([...Array(totalTiles).keys()]));
    setShowModal(false);
    setTimeLeft(initialTime);
    setGameOver(false); 
  };

  const shufflePuzzle = () => {
    setTiles(shuffleArray([...Array(totalTiles).keys()]));
  };

  return (
    <div className="puzzle-wrapper">
      <div className="header">
        <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
        <button onClick={shufflePuzzle} className="shuffle-button">Shuffle</button>
      </div>
      
      <div className="puzzle-container">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === totalTiles - 1 ? 'empty' : ''}`}
            onClick={() => handleTileClick(index)}
          >
            {tile !== totalTiles - 1 ? tile + 1 : ''}
          </div>
        ))}
      </div>

      {/* Modal to show game result */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{timeLeft > 0 ? "🎉 You won! 🎉" : "⏳ Time's up! You lost."}</h2>
            <button onClick={resetPuzzle}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidingPuzzle;
