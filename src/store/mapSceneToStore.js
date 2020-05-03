export default function mapSceneToStore(scene, store) {
  scene.on('draw', () => {
    console.log('wow!');
  });
}
