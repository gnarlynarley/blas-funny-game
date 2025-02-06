import GameLoop from './lib/GameLoop';
import Keyboard from './lib/Keyboard';
import Renderer from './lib/Renderer';
import { createPlayer } from './player';
import './style.css';

async function bootstrap() {
  const WIDTH = 600;
  const HEIGHT = WIDTH * 0.5;
  const FLOOR = HEIGHT * 0.9;

  const keyboard = new Keyboard();
  const renderer = new Renderer({
    canvas: document.querySelector('canvas')!,
    width: WIDTH,
    height: HEIGHT,
  });

  const player = await createPlayer({
    renderer,
    keyboard,
    initialX: renderer.width * 0.2,
    initialY: FLOOR,
  });

  const loop = new GameLoop({
    update(dt) {
      player.update(dt);
    },
    render() {
      const floorOffset = 8;
      renderer.clear();
      // render a floor.
      renderer.context.fillStyle = '#e7dcc7';
      renderer.context.fillRect(
        0,
        FLOOR - floorOffset,
        renderer.width,
        renderer.height - FLOOR + floorOffset
      );
      renderer.context.fillStyle = '#ae986e';
      renderer.context.fillRect(0, FLOOR - floorOffset, renderer.width, 1);
      // player render.
      player.render(renderer);
      renderer.context.save();
      renderer.context.translate(renderer.width, 0);
      renderer.context.restore();
    },
  });
  loop.start();
}

bootstrap();
