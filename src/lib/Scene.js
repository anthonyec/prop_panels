import Events from './Events';

function uidGenerator() {
  let uid = 0;

  return (name = '') => {
    uid += 1;

    return uid;
  };
}

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

    this.generateId = uidGenerator();

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

  add(component, newProps = {}) {
    const componentProps = getPropsAsArguments(component.props);
    const props = {
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      rotation: 0,
      ...componentProps,
      ...newProps
    };

    const newObject = {
      id: this.generateId(Date.now()),
      label: component.name,
      component: component,
      visible: true,
      props
    };

    this.displayList.push(newObject);
    this.emit('display-list-update');
    return newObject;
  }

  remove(id) {
    this.emit('display-list-update');
  }

  updateObject(id, prop) {
    const index = this.getObjectIndex(id);
    const object = this.displayList[index];

    const propDefinition = this.getPropDefinition(id, prop.id);

    let value = prop.value;

    // TODO: Improve value type casting.
    if (propDefinition.type === 'number') {
      value = parseFloat(value);
    }

    const newObject = {
      ...object,
      props: {
        ...object.props,
        [prop.id]: value
      }
    };

    this.displayList[index] = newObject;
    this.emit('display-list-update');
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.displayList.forEach((displayObject) => {
      const props = displayObject.props;
      const skipDrawingToMainCanvas = props.width !== 0 && props.height !== 0;

      // Draw onto a "buffer" instead of the main canvas.
      const bufferCanvas = document.createElement('canvas');
      const bufferContext = bufferCanvas.getContext('2d');

      bufferContext.canvas.width = props.width;
      bufferContext.canvas.height = props.height;

      try {
        displayObject.component.draw({
          context: bufferContext,
          ...props,

          // Position will be managed by Scene when drawing to buffer.
          x: 0,
          y: 0
        });
      } catch (err) {
        this.context.font = '16px Arial';
        this.context.fillText(
          'Component error! See console.',
          props.x + 50,
          props.y + 50
        );
        console.error(err);
      }

      if (skipDrawingToMainCanvas) {
        this.context.drawImage(bufferCanvas, props.x, props.y);
      }
    });

    this.emit('draw');
  }

  getPropDefinition(objectId, propId) {
    const object = this.getObject(objectId);

    return object.component.props.find((prop) => prop.id === propId);
  }

  getObject(objectId) {
    return this.displayList.find((object) => object.id === objectId);
  }

  getObjectIndex(objectId) {
    return this.displayList.findIndex((object) => object.id === objectId);
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

      return hitX >= x && hitY >= y && hitX <= x + width && hitY <= y + height;
    });

    const topHitItem = hitItems[hitItems.length - 1];

    return topHitItem;
  }
}
