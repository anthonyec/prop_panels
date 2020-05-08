import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'scene',
  initialState: {
    selected: [],
    objects: []
  },
  reducers: {
    singleSelectObject(state, { payload: id }) {
      state.selected = [];
      state.selected = [id];
    },
    selectObject(state, { payload: id }) {
      if (!state.selected.includes(id)) {
        state.selected.push(id);
      }
    },
    selectObjectsBetween(state, action) {
      const firstIndex = state.objects.findIndex((object) => {
        return object.id === action.payload[0];
      });
      const secondIndex = state.objects.findIndex((object) => {
        return object.id === action.payload[1];
      });

      if (firstIndex !== -1 && secondIndex !== -1) {
        const reverse = secondIndex < firstIndex;
        const objectsBetween = reverse
          ? state.objects.slice(secondIndex, firstIndex)
          : state.objects.slice(firstIndex, secondIndex + 1);
        const ids = objectsBetween.map((objectBetween) => objectBetween.id);

        // TODO: Fix leak where empty IDs are left around.
        const selectedIds = ids.filter((id) => {
          return !state.selected.includes(id);
        });

        state.selected = [...state.selected, ...selectedIds];
      }
    },
    deselectObject(state, action) {
      const index = state.selected.indexOf(action.payload);

      if (index !== -1) {
        delete state.selected[index];
      }
    },
    deselectAllOjects(state) {
      state.selected = [];
    },
    addObject(state, action) {},
    removeObject(state, action) {},
    setObjects(state, action) {
      state.objects = [...action.payload];
    }
  }
});

export const selectObject = slice.actions.selectObject;
export const deselectObject = slice.actions.deselectObject;
export const singleSelectObject = slice.actions.singleSelectObject;
export const selectObjectsBetween = slice.actions.selectObjectsBetween;
export const setObjects = slice.actions.setObjects;
export const deselectAllOjects = slice.actions.deselectAllOjects;

export function initializeScene(canvas) {
  return (dispatch, getState, { scene }) => {
    scene.init({
      canvas
    });
  };
}

export function addObjectToScene(name) {
  return async (dispatch, getState, { scene, components }) => {
    const newObject = await scene.add(components[name], {
      x: Math.floor(Math.random() * 300),
      y: Math.floor(Math.random() * 300)
    });

    dispatch(singleSelectObject(newObject.id));
  };
}

export function selectObjectAtPoint(x, y) {
  return (dispatch, getState, { scene, components }) => {
    const object = scene.hit(x, y);

    if (object) {
      dispatch(singleSelectObject(object.id));
    } else {
      dispatch(deselectAllOjects());
    }
  };
}

export function updateObjectProps(id, prop) {
  return (dispatch, getState, { scene, components }) => {
    if (!prop.value) {
      return;
    }

    scene.updateObject(id, prop);
  };
}

export default slice;
