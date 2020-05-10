import React, { useState, useEffect } from 'react';

import './TransformBox.css';

function calculateDiff(currentX, startX) {
  return Math.round(currentX - startX);
}

export default function TransformBox({ x = 0, y = 0, width = 0, height = 0, onDragMove = () => {} }) {
  const [isMouseDown, setMouseDown] = useState(false);
  const [currentPositionX, setCurrentPositionX] = useState(x);
  const [currentPositionY, setCurrentPositionY] = useState(y);
  const [positionX, setPositionX] = useState(x);
  const [positionY, setPositionY] = useState(y);
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);
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
    if (!isMouseDown) {
      // TODO: Better way to do this?
      setPositionX(x);
      setPositionY(y);
      setCurrentPositionX(x);
      setCurrentPositionY(y);
      setCurrentWidth(width);
      setCurrentHeight(height);
    }
  }, [isMouseDown, x, y, width, height])

  useEffect(() => {
    if (isMouseDown) {
      const diffX = calculateDiff(currentX, startX);
      const diffY = calculateDiff(currentY, startY);
      const newX = positionX + diffX;
      const newY = positionY + diffY;

      setCurrentPositionX(newX);
      setCurrentPositionY(newY);

      onDragMove(newX, newY);
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
    width: currentWidth,
    height: currentHeight,
    transform: `translate(${currentPositionX}px, ${currentPositionY}px)`
  };

  return (
    <div
      style={style}
      className="TransformBox"
      onMouseDown={handleOnMouseDown}
    />
  );
}
