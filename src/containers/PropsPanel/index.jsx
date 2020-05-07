import React, { useEffect } from 'react';
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

  const handlePropValueUpdate = function(prop, object, evt) {
    console.log(prop, object, evt.target.value);
    // dispatch(updateObjectProps())
  };

  const items = objects.map((object) => {
    const props = object.component.props;

    return props.map((prop) => {
      const propComponent = (
        <div key={prop.id}>
          <label>{prop.id}</label>
          <input type="text" defaultValue={prop.default} onChange={handlePropValueUpdate.bind(null, prop, object)} />
        </div>
      );

      return <div className="props">{propComponent}</div>;
    });
  });

  return (
    <div>
      Properties:
      {items}
    </div>
  );
}
