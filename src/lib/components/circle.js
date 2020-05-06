export default {
  name: 'Circle',
  props: [
    { id: 'width', type: 'number', default: 50 },
    { id: 'height', type: 'number', default: 50 },
    { id: 'radius', type: 'number', default: 50 },
    { id: 'color', type: 'color', default: 'blue' }
  ],
  draw: ({ context, x, y, radius, color }) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x + radius / 2, y + radius / 2, radius / 2, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }
};
