export default {
  name: 'Stretcher',
  props: [
    { id: 'x', type: 'number', default: 0 },
    { id: 'y', type: 'number', default: 0 },
    { id: 'width', type: 'number', default: 300 },
    { id: 'height', type: 'number', default: 200 },
    { id: 'percent', type: 'number', default: 0.5, min: 0, max: 1 },
    { id: 'horizontal', type: 'boolean', default: false },
    { id: 'referenceA', type: 'context' },
    { id: 'referenceB', type: 'context' }
  ],
  draw: ({ context, width, height, percent, referenceA, referenceB }) => {
    const stetchPosition = width * percent;

    context.font = '16px Arial';

    if (referenceA) {
      context.drawImage(referenceA, 0, 0, stetchPosition, height);
    } else {
      context.strokeRect(0, 0, stetchPosition, height);
      context.fillText('a', stetchPosition / 2, height / 2);
    }

    if (referenceB) {
      context.drawImage(
        referenceB,
        stetchPosition,
        0,
        width - stetchPosition,
        height
      );
    } else {
      context.strokeRect(stetchPosition, 0, width - stetchPosition, height);
      context.fillText(
        'b',
        stetchPosition + (width - stetchPosition) / 2,
        height / 2
      );
    }
  }
};
