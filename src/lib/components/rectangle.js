export default {
  name: 'Rectangle',
  props: [
    { id: 'width', type: 'number', default: 50 },
    { id: 'height', type: 'number', default: 50 },
    { id: 'color', type: 'color', default: 'red' }
  ],
  draw: ({ context, x, y, width, height, color }) => {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  }
};
