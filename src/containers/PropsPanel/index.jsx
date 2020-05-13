import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { updateObjectProp } from '../../store/scene';

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
    dispatch(updateObjectProp(object.id, { id: prop.id, value: value }));
  };

  const items = objects.map((object) => {
    const props = object.component.props;

    const propComponents = props.map((prop) => {
      let type = prop.type;

      if (prop.min !== undefined && prop.max !== undefined) {
        type = 'range';
      }

      return (
        <div className="props__field" key={prop.id}>
          <label htmlFor={prop.id}>{prop.id}</label>
          <input
            id={prop.id}
            type={type}
            min={prop.min}
            max={prop.max}
            step={0.01}
            defaultValue={object.props[prop.id]}
            onChange={handlePropValueUpdate.bind(null, prop, object)}
          />
        </div>
      );
    });

    return (
      <div className="props" key={object.id}>
        <h3 className="props__title">{object.component.name}</h3>
        <div className="props__group">{propComponents}</div>
      </div>
    );
  });

  return <div className="PropsPanel">{items}</div>;
}
