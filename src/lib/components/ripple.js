function oscillator(time, frequency = 1, amplitude = 1, phase = 0, offset = 0) {
  return Math.sin(time * frequency + phase * Math.PI * 2) * amplitude + offset;
}

export default {
  name: 'Ripple',
  props: [
    { id: 'x', type: 'number', default: 0 },
    { id: 'y', type: 'number', default: 0 },
    { id: 'width', type: 'number', default: 300 },
    { id: 'height', type: 'number', default: 300 },
    { id: 'frequency', type: 'number', default: 0.5, min: 0, max: 1 },
    { id: 'amplitude', type: 'number', default: 5, min: 0, max: 100 },
    { id: 'phase', type: 'number', default: 10, min: 0, max: 1 },
    { id: 'direction', type: 'string', default: 'h' },
    { id: 'reference', type: 'context', default: 'root', hidden: true }
  ],
  draw: ({
    context,
    x,
    y,
    width,
    height,
    reference,
    frequency,
    amplitude,
    phase,
    offset = 0,
    direction
  }) => {
    if (!reference) {
      return;
    }

    if (direction === 'h') {
      for (let posY = 0; posY < height; posY++) {
        context.drawImage(
          reference,
          x + oscillator(posY, frequency, amplitude, phase, offset),
          y + posY,
          width,
          1,
          0,
          posY,
          width,
          1
        );
      }
    } else {
      for (let posX = 0; posX < width; posX++) {
        context.drawImage(
          reference,
          x + posX,
          y + oscillator(posX, frequency, amplitude, phase, offset),
          1,
          height,
          posX,
          0,
          1,
          height
        );
      }
    }
  }
};
