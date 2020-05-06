import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'scene',
  initialState: {
    selected: [],
    objects: []
  },
  reducers: {
    singleSelectObject(state, action) {
      state.selected = [action.payload];
    },
    selectObject(state, action) {
      if (!state.selected.includes(action.payload)) {
        state.selected.push(action.payload);
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

        state.selected = [...state.selected, ...ids];
      }
    },
    deselectObject(state, action) {
      const index = state.selected.indexOf(action.payload);

      if (index !== -1) {
        delete state.selected[index];
      }
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

export function initializeScene(canvas) {
  return (dispatch, getState, { scene }) => {
    scene.init({
      canvas
    });
  };
}

export function addObjectToScene(name) {
  return (dispatch, getState, { scene, components }) => {
    scene.add(components[name]);
  };
}

export default slice;
