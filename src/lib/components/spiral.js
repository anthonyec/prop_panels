const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const getPos = (angle, rad, cx = 0, cy = 0) => {
  return [cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad];
};

export default {
  name: 'Spiral',
  props: [
    { id: 'x', type: 'number' },
    { id: 'y', type: 'number' },
    { id: 'width', type: 'number', default: 500 },
    { id: 'height', type: 'number', default: 500 },
    { id: 't', type: 'number', default: 0.5 },
    { id: 'color', type: 'color', default: 'rgba(0, 0, 0, 1)' }
  ],
  draw: ({ context, x, y, width, height, rings = 1, color, t = 0.5}) => {
    const cx = width / 2;
    const cy = height / 2;

    const drawRing = (context, x, rad, offset = 0, count = 5) => {
      const currentRad = Math.sin(x) * rad;
      for (let i = 0; i < count; i++) {
        const percentage = i / count;
        let angle = Math.PI * 2 * percentage;
        angle = angle * x;
        angle += Math.PI * 2 * x;
        angle += offset;
        const pos = getPos(angle, currentRad);
        context.fillStyle = color;
        context.beginPath();
        context.arc(...pos, 5 * x, 0, Math.PI * 2);
        context.closePath();
        context.fill();
      }
    };

    const mappedX = map(t, 0.25, 0.75, 0, 1);

    context.translate(cx, cy);

    for (let i = 1, rings = 10; i <= rings; i++) {
      const percentage = i / (rings - 1);
      const rad = cx * percentage;
      const offset = Math.PI * 2 * percentage;
      drawRing(context, mappedX, rad, offset, rings);
    }

    // context.setTransform(1, 0, 0, 1, 0, 0);
  }
}
