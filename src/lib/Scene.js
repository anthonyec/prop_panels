import Events from './Events';

export default class Scene extends Events {
  constructor(props = { canvas: null }) {
    super();

    if (!props.canvas) {
      console.warn(
        'No canvas provided to Scene. No worries, instead manually initialise with `.init(props)`'
      );
      return;
    }

    this.init(props);
  }

  init(props) {
    if (!props.canvas) {
      console.warn('No canvas provided to Scene with `.init(props)`!');
      return;
    }

    this.canvas = props.canvas;
    this.context = props.canvas.getContext('2d');
    this.displayList = [];

    this.update();
  }

  add(displayObject) {
    const defaultComponent = {
      props: {
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        rotation: 0
      },
      draw: () => {}
    };

    this.displayList.push({
      id: Date.now() + '' + Math.floor(Math.random() * 99),
      label: 'Untitled item',
      visible: true,
      component: defaultComponent,
      ...displayObject
    });

    this.emit('display-list-update');
  }

  remove(id) {
    this.emit('display-list-update');
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.displayList.forEach((displayObject) => {
      displayObject.draw();
    });

    this.emit('draw');
  }

  resizeCanvas() {
    this.context.canvas.width = this.canvas.clientWidth;
    this.context.canvas.height = this.canvas.clientHeight;
  }

  update() {
    this.resizeCanvas();
    this.draw();
    this.emit('update');
    window.requestAnimationFrame(this.update.bind(this));
  }
}
