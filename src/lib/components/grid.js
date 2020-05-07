export default {
  name: 'Grid',
  props: [
    { id: 'x', type: 'number', default: 0 },
    { id: 'y', type: 'number', default: 0 },
    { id: 'width', type: 'number', default: 100 },
    { id: 'height', type: 'number', default: 100 },
    { id: 'columns', type: 'number', default: 10 },
    { id: 'rows', type: 'number', default: 10 },
    { id: 'color', type: 'color', default: 'gray' },
  ],
  draw: ({ context, x, y, width, height, color, rows, columns }) => {
    context.fillStyle = color;

    const xSeg = (width / columns);
    const ySeg = (height / rows);

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        context.fillRect(((width + xSeg) / columns) * col, ((height + ySeg) / rows) * row, 2, 2);
      }
    }
  }
};
