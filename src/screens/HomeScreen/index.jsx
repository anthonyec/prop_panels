import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  singleSelectObject,
  selectObject,
  deselectObject,
  selectObjectsBetween,
  initializeScene
} from '../../store/scene';

import './HomeScreen.css';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const objectList = useSelector((state) => state.scene.objects);
  const selectedObjectIds = useSelector((state) => state.scene.selected);
  const canvasRef = useRef(null);

  useEffect(() => {
    dispatch(initializeScene(canvasRef.current));
  }, []);

  const handleItemOnClick = (id, selected, evt) => {
    if (evt.shiftKey) {
      dispatch(
        selectObjectsBetween([
          selectedObjectIds[selectedObjectIds.length - 1],
          id
        ])
      );
      return;
    }

    if (evt.metaKey && !selected) {
      dispatch(selectObject(id));
    } else if (evt.metaKey && selected) {
      dispatch(deselectObject(id));
    } else {
      dispatch(singleSelectObject(id));
    }
  };

  const list = objectList.map((object) => {
    const selected = selectedObjectIds.includes(object.id);
    const selectedClass = selected ? 'listItem--selected' : '';

    return (
      <li
        className={`listItem ${selectedClass}`}
        defaultValue={object.id}
        key={object.label + object.id}
        onClick={handleItemOnClick.bind(null, object.id, selected)}
        draggable
      >
        {object.label}
      </li>
    );
  });

  return (
    <main className="HomeScreen">
      <ol>{list}</ol>

      <canvas ref={canvasRef}></canvas>
    </main>
  );
}
