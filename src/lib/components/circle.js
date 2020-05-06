export default {
  name: 'Circle',
  props: [
    { id: 'radius', type: 'number', default: 50 },
    { id: 'color', type: 'color', default: 'blue' }
  ],
  draw: ({ context, radius, color }) => {
    const x = 0;
    const y = 0;

    context.fillStyle = color;
    context.arc(x + radius / 2, y + radius / 2, radius / 2, 0, 2 * Math.PI);
    context.fill();
  }
}
