export default {
  name: 'Repeater',
  props: [
    { id: 'x', type: 'number', default: 0 },
    { id: 'y', type: 'number', default: 0 },
    { id: 'width', type: 'number', default: 300 },
    { id: 'height', type: 'number', default: 200 },
    { id: 'fill', type: 'color', default: '#FFFFFF' },
    { id: 'tileX', type: 'number', default: 0 },
    { id: 'tileY', type: 'number', default: 0 },
    { id: 'tileWidth', type: 'number', default: 100 },
    { id: 'tileHeight', type: 'number', default: 100 },
    { id: 'reference', type: 'context' }
  ],
  draw: ({
    context,
    width,
    height,
    fill,
    reference,
    tileX,
    tileY,
    tileWidth,
    tileHeight
  }) => {
    const multiplierX = Math.floor(tileX / tileWidth);
    const multiplierY = Math.floor(tileY / tileHeight);
    const offsetX = tileX - tileWidth * multiplierX;
    const offsetY = tileY - tileHeight * multiplierY;

    const cols = Math.ceil(width / tileWidth);
    const rows = Math.ceil(height / tileHeight);

    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);

    for (let col = -1; col < cols; col++) {
      for (let row = -1; row < rows; row++) {
        const cloneX = offsetX + tileWidth * col;
        const cloneY = offsetY + tileHeight * row;

        if (!reference) {
          context.strokeRect(cloneX, cloneY, tileWidth, tileHeight);
        } else {
          context.drawImage(reference, cloneX, cloneY, tileWidth, tileHeight);
        }
      }
    }
  }
};
