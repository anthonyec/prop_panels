import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import scene from './scene';

export default (preloadedState = {}, dependencies = {}) => {
  return configureStore({
    reducer: {
      scene: scene.reducer
    },
    middleware: [thunk.withExtraArgument(dependencies)],
    preloadedState
  });
};
