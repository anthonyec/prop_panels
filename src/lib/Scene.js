import Events from './Events';

function uidGenerator() {
  let uid = 0;

  return () => {
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

function arrayMove(arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing purposes
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

  async add(component, newProps = {}) {
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

    // TODO: Is this a good way to do it?? I don't think add should be async
    // as it holds up everything. Find a way to setup up components on first
    // maybe.
    let propsFromSetup = {};

    if (component.setup) {
      propsFromSetup = await component.setup(props);
    }

    const newObject = {
      id: this.generateId(Date.now()),
      label: component.name,
      component: component,
      visible: true,
      props: {
        ...props,
        ...propsFromSetup
      }
    };

    this.displayList.push(newObject);
    this.emit('display-list-update');
    return newObject;
  }

  remove(objectId) {
    const index = this.getObjectIndex(objectId);

    this.displayList = [
      ...this.displayList.slice(0, index),
      ...this.displayList.slice(index + 1)
    ];

    this.emit('display-list-update');
  }

  reorder(objectId, direction = 0) {
    const index = this.getObjectIndex(objectId);
    const newIndex = index + direction;

    if (newIndex < 0) {
      return 0;
    }

    if (newIndex > this.displayList.length - 1) {
      return this.displayList.length - 1;
    }

    this.displayList = arrayMove(this.displayList, index, newIndex);
    this.emit('display-list-update');
  }

  updateObjectProp(id, prop) {
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

  updateObjectMetadata(id, metadata) {
    const index = this.getObjectIndex(id);
    const object = this.displayList[index];

    const newObject = {
      ...object,
      ...metadata,
      id: object.id,
      component: object.component,
      props: object.props
    };

    this.displayList[index] = newObject;
    this.emit('display-list-update');
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.displayList.forEach((displayObject) => {
      const props = displayObject.props;
      const widthOrHeightIsZero = props.width === 0 || props.height === 0;

      const shouldDrawToMainCanvas =
        displayObject.visible && !widthOrHeightIsZero;

      // Draw onto a "buffer" instead of the main canvas.
      const bufferCanvas = document.createElement('canvas');
      const bufferContext = bufferCanvas.getContext('2d');

      bufferContext.canvas.width = props.width;
      bufferContext.canvas.height = props.height;

      if (shouldDrawToMainCanvas) {
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
