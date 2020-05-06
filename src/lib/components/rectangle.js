export default {
  name: 'Rectangle',
  props: [
    { id: 'width', type: 'number', default: 50 },
    { id: 'height', type: 'number', default: 50 },
    { id: 'color', type: 'color', default: 'red' }
  ],
  draw: ({ context, width, height, color }) => {
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
  }
};
