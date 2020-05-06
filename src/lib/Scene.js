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

    this.emit('init');
    this.update();
  }

  add(displayObject, newProps = {}) {
    const displayObjectProps = getPropsAsArguments(displayObject.props);
    const props = {
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      rotation: 0,
      ...displayObjectProps,
      ...newProps
    };

    this.displayList.push({
      id: Date.now() + '' + Math.floor(Math.random() * 99),
      label: displayObject.name,
      component: displayObject,
      visible: true,
      props
    });

    this.emit('display-list-update');
  }

  remove(id) {
    this.emit('display-list-update');
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.displayList.forEach((displayObject) => {
      const props = displayObject.props;

      this.context.strokeRect(props.x, props.y, props.width, props.height);
      // this.context.strokeRect();
      displayObject.component.draw({ context: this.context, ...props });
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

  hit(hitX, hitY) {
    const hitItems = this.displayList.filter((displayItem) => {
      const { x, y, width, height } = displayItem.props;

      console.log(displayItem.props);

      return hitX >= x && hitY >= y && hitX <= x + width && hitY <= y + height;
    });

    const topHitItem = hitItems[hitItems.length - 1];

    return topHitItem;
  }
}
