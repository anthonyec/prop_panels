import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  singleSelectObject,
  selectObject,
  deselectObject,
  selectObjectsBetween,
  initializeScene,
  addObjectToScene,
  selectObjectAtPoint,
  updateObjectProps
} from '../../store/scene';

import './PropsPanel.css';

// TODO: Remove duplication
function selectSelectedObjects(state) {
  return state.scene.selected.map((id) => {
    return state.scene.objects.find((object) => object.id === id);
  });
}

export default function PropsPanel() {
  const dispatch = useDispatch();

  const objects = useSelector(selectSelectedObjects);

  const handlePropValueUpdate = function (prop, object, evt) {
    const value = evt.target.value;
    dispatch(updateObjectProps(object.id, { id: prop.id, value: value }));
  };

  const items = objects.map((object) => {
    const props = object.component.props;

    const propComponents = props.map((prop) => {
      const type = prop.type === 'number' ? 'number' : 'text';

      return (
        <div key={prop.id}>
          <label>{prop.id}</label>
          <input
            type={type}
            defaultValue={object.props[prop.id]}
            onChange={handlePropValueUpdate.bind(null, prop, object)}
          />
        </div>
      );
    });

    return (
      <div className="props" key={object.id}>
        {propComponents}
      </div>
    );
  });

  return (
    <div className="PropsPanel">
      Properties:
      {items}
    </div>
  );
}
