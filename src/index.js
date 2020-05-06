import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import createStore from './store/index';
import mapSceneToStore from './store/mapSceneToStore';
import Scene from './lib/Scene';
import * as components from './lib/components';

import App from './app';

const scene = new Scene();

const store = createStore(
  {},
  {
    scene,
    components
  }
);

mapSceneToStore(scene, store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
