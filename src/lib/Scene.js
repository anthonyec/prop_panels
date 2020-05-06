import Events from './Events';

function getPropsAsArguments(props) {
  let args = {};

  props.forEach((prop) => {
    args[prop.id] = prop.default;
  });

  return args;
}

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

    this.canvas.addEventListener('click', this.handleOnCanvasClick.bind(this));

    this.emit('init');
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
      label: displayObject.name,
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
      const defaultProps = getPropsAsArguments(displayObject.props);

      displayObject.draw({ context: this.context, ...defaultProps });
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

  handleOnCanvasClick(evt) {
    const mouseX = evt.offsetX;
    const mouseY = evt.offsetY;

    console.log(this.displayList);

    const items = this.displayList.filter((displayItem) => {
      const { x, y, width, height } = displayItem.props;

      console.log(displayItem);

      return( mouseX >= x && mouseY >= y) && (mouseX <= x + width && mouseY <= y + height);
    });

    const top = items[items.length - 1];
    console.log(items, mouseX, mouseY);
  }
}
