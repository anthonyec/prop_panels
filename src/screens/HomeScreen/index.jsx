import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PropsPanel from '../../containers/PropsPanel';

import {
  singleSelectObject,
  selectObject,
  deselectObject,
  selectObjectsBetween,
  initializeScene,
  addObjectToScene,
  selectObjectAtPoint,
  reorderObject,
  removeObject,
  updateObjectMetadata,
  updateObjectProp
} from '../../store/scene';

import './HomeScreen.css';
import TransformBox from '../../components/TransformBox';

function selectSelectedObjects(state) {
  return state.scene.selected.map((id) => {
    return state.scene.objects.find((object) => object.id === id);
  });
}

export default function HomeScreen() {
  const dispatch = useDispatch();

  const objectList = useSelector((state) => state.scene.objects);
  const selectedObjectIds = useSelector((state) => state.scene.selected);
  const selectedObjects = useSelector(selectSelectedObjects);

  const selectedBounds = useSelector((state) => {
    const selectedObjectsInState = selectSelectedObjects(state);

    if (!selectedObjectsInState.length) {
      return;
    }

    const allMinX = selectedObjectsInState.map((object) => object.props.x);
    const allMinY = selectedObjectsInState.map((object) => object.props.y);
    const allMaxX = selectedObjectsInState.map(
      (object) => object.props.x + object.props.width
    );
    const allMaxY = selectedObjectsInState.map(
      (object) => object.props.y + object.props.height
    );

    const minX = Math.min(...allMinX);
    const minY = Math.min(...allMinY);
    const maxX = Math.max(...allMaxX);
    const maxY = Math.max(...allMaxY);

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  });

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

  const handleLayerMoveClick = (id, direction, evt) => {
    evt.stopPropagation();
    dispatch(reorderObject(id, direction));
  };

  const handleLayerShowClick = (id, evt) => {
    evt.stopPropagation();

    dispatch(
      updateObjectMetadata(id, {
        visible: true
      })
    );
  };

  const handleLayerHideClick = (id, evt) => {
    evt.stopPropagation();

    dispatch(
      updateObjectMetadata(id, {
        visible: false
      })
    );
  };

  const handleLayerDeleteClick = (id, evt) => {
    evt.stopPropagation();
    dispatch(removeObject(id));
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

        <div>
          <button onClick={handleLayerMoveClick.bind(null, object.id, 1)}>
            ↓
          </button>
          <button onClick={handleLayerMoveClick.bind(null, object.id, -1)}>
            ↑
          </button>
          <button onClick={handleLayerShowClick.bind(null, object.id)}>
            👁
          </button>
          <button onClick={handleLayerHideClick.bind(null, object.id)}>
            X👁
          </button>
          <button onClick={handleLayerDeleteClick.bind(null, object.id)}>
            X
          </button>
        </div>
      </li>
    );
  });

  const selections = selectedObjects.map((selectedObject, index) => {
    const style = {
      left: selectedObject.props.x,
      top: selectedObject.props.y,
      width: selectedObject.props.width,
      height: selectedObject.props.height
    };

    return <div className="selection" style={style} key={selectedObject.id} />;
  });

  const selection = selectedBounds ? (
    <div
      className="selection"
      style={{
        left: selectedBounds.x,
        top: selectedBounds.y,
        width: selectedBounds.width,
        height: selectedBounds.height
      }}
    >
      <div className="selection__handle selection__handle--nw"></div>
      <div className="selection__handle selection__handle--ne"></div>
      <div className="selection__handle selection__handle--se"></div>
      <div className="selection__handle selection__handle--sw"></div>
    </div>
  ) : null;

  // const handleOnDragMove = (x, y) => {
  //   // console.log(x, y, selectedObjects);
  //   // TODO: Combine into single prop update.
  //   dispatch(updateObjectProp(selectedObjects[0].id, { id: 'x', value: x }));
  //   dispatch(updateObjectProp(selectedObjects[0].id, { id: 'y', value: y }));
  // };

  // const selection = selectedBounds ? <TransformBox
  //   x={selectedBounds.x}
  //   y={selectedBounds.y}
  //   width={selectedBounds.width}
  //   height={selectedBounds.height}
  //   onDragMove={handleOnDragMove}
  // /> : null;

  return (
    <main className="HomeScreen">
      <div className="layers">
        <div>
          <button onClick={handleAddOnClick.bind(null, 'rectangle')}>
            Rectangle
          </button>
          <button onClick={handleAddOnClick.bind(null, 'circle')}>
            Circle
          </button>
          <button onClick={handleAddOnClick.bind(null, 'spiral')}>
            Spiral
          </button>
          <button onClick={handleAddOnClick.bind(null, 'grid')}>Grid</button>
          <button onClick={handleAddOnClick.bind(null, 'image')}>Image</button>
          <button onClick={handleAddOnClick.bind(null, 'fieldGrid')}>
            Field Grid
          </button>
          <button onClick={handleAddOnClick.bind(null, 'repeater')}>
            Repeater
          </button>
          <button onClick={handleAddOnClick.bind(null, 'stretcher')}>
            Stretcher
          </button>
          <button onClick={handleAddOnClick.bind(null, 'text')}>Text</button>
          <button onClick={handleAddOnClick.bind(null, 'ripple')}>
            Ripple
          </button>
        </div>
        <ol className="layers__list">{list}</ol>
      </div>

      <div className="workspace">
        <div className="workspace__canvas-container">
          <canvas
            className="workspace__canvas"
            onClick={handleCanvasClick}
            ref={canvasRef}
            width={500}
            height={400}
          />
          {selections}
          {selection}
        </div>
      </div>

      <div className="propertyPanel">
        <PropsPanel />
      </div>
    </main>
  );
}

// width={500}
// height={400}
