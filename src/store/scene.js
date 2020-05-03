import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'scene',
  initialState: {
    selected: [],
    objects: [
      {
        id: '1',
        label: 'Rectangle'
      },
      {
        id: '2',
        label: 'Circle'
      },
      {
        id: '3',
        label: 'Triangle'
      },
      {
        id: '4',
        label: 'Rectangle'
      },
      {
        id: '5',
        label: 'Circle'
      },
      {
        id: '6',
        label: 'Triangle'
      },
      {
        id: '7',
        label: 'Rectangle'
      },
      {
        id: '8',
        label: 'Circle'
      },
      {
        id: '9',
        label: 'Triangle'
      },
      {
        id: '10',
        label: 'Rectangle'
      },
      {
        id: '11',
        label: 'Circle'
      },
      {
        id: '12',
        label: 'Triangle'
      }
    ]
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
    removeObject(state, action) {}
  }
});

export const selectObject = slice.actions.selectObject;
export const deselectObject = slice.actions.deselectObject;
export const singleSelectObject = slice.actions.singleSelectObject;
export const selectObjectsBetween = slice.actions.selectObjectsBetween;

export function initializeScene(canvas) {
  return (dispatch, getState, { scene }) => {
    scene.init({
      canvas
    });
  };
}

export default slice;
