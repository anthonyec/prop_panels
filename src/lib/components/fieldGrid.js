const { lerp } = require('canvas-sketch-util/math');

function draw (context, x, y, length, thickness, rotation, color) {
  context.save();
  context.fillStyle = color;

  // Rotate in place
  context.translate(x, y);
  context.rotate(rotation);
  context.translate(-x, -y);

  // Draw the line
  context.fillRect(x - length / 2, y - thickness / 2, length, thickness);
  context.restore();
}

export default {
  name: 'Field Grid',
  props: [
    { id: 'x', type: 'number', default: 0 },
    { id: 'y', type: 'number', default: 0 },
    { id: 'width', type: 'number', default: 400 },
    { id: 'height', type: 'number', default: 400 },
    { id: 'columns', type: 'number', default: 10 },
    { id: 'rows', type: 'number', default: 10 },
    { id: 'padding', type: 'number', default: 10 },
    { id: 'playhead', type: 'number', default: 0.2 },
    { id: 'color', type: 'color', default: 'gray' }
  ],
  draw: ({ context, x, y, width, height, color, rows, columns, playhead, padding }) => {
    const gridSize = rows;
    const tileSize = (width - padding * 2) / gridSize;

    for (let x = -4; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        // get a 0..1 UV coordinate
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);

        // scale to dimensions with a border padding
        const tx = lerp(padding, width - padding, u);
        const ty = lerp(padding, height - padding, v);

        // here we get a 't' value between 0..1 that
        // shifts subtly across the UV coordinates
        const offset = u * 0.5 + v * 0.5;
        const t = (playhead + offset) % 1;

        // now we get a value that varies from 0..1 and back
        let mod = Math.sin(t * Math.PI);

        // we make it 'ease' a bit more dramatically with exponential
        mod = Math.pow(mod, 3);

        // now choose a length, thickness and initial rotation
        const length = tileSize * 0.65;
        const thickness = tileSize * 0.1;
        const initialRotation = Math.PI / 2;

        // And rotate each line a bit by our modifier
        const rotation = initialRotation + mod * Math.PI;

        // Now render...
        draw(context, tx, ty, length, thickness, rotation, color);
      }
    }
  }
};
