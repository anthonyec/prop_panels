import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  singleSelectObject,
  selectObject,
  deselectObject,
  selectObjectsBetween,
  initializeScene,
  addObjectToScene,
  selectObjectAtPoint
} from '../../store/scene';

import './HomeScreen.css';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const objectList = useSelector((state) => state.scene.objects);
  const selectedObjectIds = useSelector((state) => state.scene.selected);
  const selectedObjects = useSelector((state) => {
    return state.scene.selected.map((id) => {
      return state.scene.objects.find((object) => object.id === id);
    });
  });

  console.log(selectedObjects);

  const canvasRef = useRef(null);

  useEffect(() => {
    dispatch(initializeScene(canvasRef.current));
  }, []);

  const handleAddOnClick = (name) => {
    dispatch(addObjectToScene(name));
  };

  const handleCanvasClick = function (evt) {
    const bounds = evt.target.getBoundingClientRect();
    dispatch(
      selectObjectAtPoint(evt.clientX - bounds.x, evt.clientY - bounds.y)
    );
  };

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

  const selections = selectedObjects.map((selectedObject, index) => {
    console.log(selectedObject)
    const style = {
      left: selectedObject.props.x,
      top: selectedObject.props.y,
      width: selectedObject.props.width,
      height: selectedObject.props.height
    };

    return (
      <div className="selection" style={style} key={selectedObject.id} />
    )
  });

  return (
    <main className="HomeScreen">
      <button onClick={handleAddOnClick.bind(null, 'rectangle')}>
        Add Rectangle
      </button>
      <button onClick={handleAddOnClick.bind(null, 'circle')}>
        Add Circle
      </button>

      <ol>{list}</ol>

      <div className="canvas">
        <canvas onClick={handleCanvasClick} ref={canvasRef} width={500} height={500} />
        {selections}
      </div>
    </main>
  );
}
