export default {
  name: 'Rectangle',
  props: [
    { id: 'x', type: 'number', default: 0 },
    { id: 'y', type: 'number', default: 0 },
    { id: 'width', type: 'number', default: 50 },
    { id: 'height', type: 'number', default: 50 },
    { id: 'color', type: 'color', default: 'red' }
  ],
  draw: ({ context, x, y, width, height, color }) => {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  }
};
