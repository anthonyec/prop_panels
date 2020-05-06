import { setObjects } from "./scene";

export default function mapSceneToStore(scene, store) {
  scene.on('init', () => {
    store.dispatch(setObjects(scene.displayList));
  });

  scene.on('display-list-update', () => {
    store.dispatch(setObjects(scene.displayList));
  });
}
