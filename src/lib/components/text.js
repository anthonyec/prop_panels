export default {
  name: 'Text',
  props: [
    { id: 'x', type: 'number', default: 0 },
    { id: 'y', type: 'number', default: 0 },
    { id: 'width', type: 'number', default: 300 },
    { id: 'height', type: 'number', default: 16 },
    { id: 'fontSize', type: 'number', default: 16 },
    { id: 'text', type: 'string', default: 'Hello world' },
  ],
  draw: ({
    context,
    width,
    height,
    fontSize,
    text
  }) => {
    let x = 0;
    let y = 0;

    context.textBaseline = 'top';
    context.font = `${fontSize}px Arial`;

    const textMetrics = context.measureText(text);

    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = 'green';
    context.moveTo(
      x - textMetrics.actualBoundingBoxLeft,
      y - textMetrics.actualBoundingBoxAscent
    );
    context.lineTo(
      x + textMetrics.actualBoundingBoxRight,
      y - textMetrics.actualBoundingBoxAscent
    );
    context.lineTo(
      x + textMetrics.actualBoundingBoxRight,
      y + textMetrics.actualBoundingBoxDescent
    );
    context.lineTo(
      x - textMetrics.actualBoundingBoxLeft,
      y + textMetrics.actualBoundingBoxDescent
    );
    context.closePath();
    context.stroke();

    context.fillText(text, x, y);
  }
};
