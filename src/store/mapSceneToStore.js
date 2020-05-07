import { setObjects } from './scene';

export default function mapSceneToStore(scene, store) {
  scene.on('init', () => {
    store.dispatch(setObjects(scene.displayList));
  });

  scene.on('display-list-update', () => {
    console.log('mapSceneToStore->display-list-update', scene.displayList)
    store.dispatch(setObjects(scene.displayList));
  });
}
