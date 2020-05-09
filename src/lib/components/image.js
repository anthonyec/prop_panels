function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.src = url;

    image.onload = () => {
      resolve(image);
    };
  });
}

export default {
  name: 'Image',
  props: [
    { id: 'x', type: 'number', default: 0 },
    { id: 'y', type: 'number', default: 0 },
    { id: 'width', type: 'number', default: 100 },
    { id: 'height', type: 'number', default: 100 },
    {
      id: 'src',
      type: 'string',
      default:
        'http://gnorman.net/14719302_1718032978521645_5551615692484116480_n.jpg'
    }
  ],
  setup: async function ({ context, src }) {
    const image = await loadImage(src);

    return { image, width: image.width, height: image.height };
  },
  draw: ({ context, image = null }) => {
    if (image) {
      context.drawImage(image, 0, 0);
    }
  }
};
