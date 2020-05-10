import React, { useState, useEffect } from 'react';

import './TransformBox.css';

function calculateDiff(currentX, startX) {
  return Math.round(currentX - startX);
}

export default function TransformBox() {
  const [isMouseDown, setMouseDown] = useState(false);
  const [currentPositionX, setCurrentPositionX] = useState(0);
  const [currentPositionY, setCurrentPositionY] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  useEffect(() => {
    document.addEventListener('mousemove', handleOnMouseMove);
    document.addEventListener('mouseup', handleOnMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleOnMouseMove);
      document.removeEventListener('mouseup', handleOnMouseUp);
    };
  }, []);

  useEffect(() => {
    if (isMouseDown) {
      const diffX = calculateDiff(currentX, startX);
      const diffY = calculateDiff(currentY, startY);

      setCurrentPositionX(positionX + diffX);
      setCurrentPositionY(positionY + diffY);
    }
  }, [currentX, currentY]);

  useEffect(() => {
    if (!isMouseDown) {
      const diffX = calculateDiff(currentX, startX);
      const diffY = calculateDiff(currentY, startY);

      setPositionX(positionX + diffX);
      setPositionY(positionY + diffY);
    }
  }, [isMouseDown]);

  const handleOnMouseMove = (evt) => {
    setCurrentX(evt.pageX);
    setCurrentY(evt.pageY);
  };

  const handleOnMouseDown = (evt) => {
    setStartX(evt.pageX);
    setStartY(evt.pageY);
    setMouseDown(true);
  };

  const handleOnMouseUp = () => {
    setMouseDown(false);
  };

  const style = {
    left: currentPositionX,
    top: currentPositionY
  };

  return (
    <div
      style={style}
      className="TransformBox"
      onMouseDown={handleOnMouseDown}
    />
  );
}
