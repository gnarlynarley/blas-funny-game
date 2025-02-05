import AnimationSprite from './lib/AnimationSprite';
import GameLoop from './lib/GameLoop';
import GameObject from './lib/GameObject';
import Keyboard from './lib/Keyboard';
import Renderer from './lib/Renderer';
import Vector from './lib/Vector';
import walkingSpriteSrc from './sprites/ristarwalkingfinal.png';
import idleSpriteSrc from './sprites/ristaridle.png';
import jumpSpriteSrc from './sprites/ristarjumpingsprite.png';
import './style.css';

async function bootstrap() {
  const WIDTH = 400;
  const HEIGHT = WIDTH * 0.5;
  const FLOOR = HEIGHT * 0.9;

  const keyboard = new Keyboard();
  const renderer = new Renderer({
    canvas: document.querySelector('canvas')!,
    width: WIDTH,
    height: HEIGHT,
  });

  async function createPlayer() {
    let directionForwards = true;

    const walkingSprite = await AnimationSprite.fromSrc({
      src: walkingSpriteSrc,
      frames: 8,
      gap: 1,
      padding: 1,
      fps: 24,
    });
    const idleSprite = await AnimationSprite.fromSrc({
      src: idleSpriteSrc,
      frames: 1,
      gap: 1,
      padding: 1,
      fps: 24,
      offsetX: 3,
      offsetY: 1,
    });
    const jumpSprite = await AnimationSprite.fromSrc({
      src: jumpSpriteSrc,
      frames: 4,
      gap: 1,
      padding: 1,
      fps: 24,
      offsetX: 1,
      offsetY: 1,
      once: true,
    });

    const sprites = [walkingSprite, idleSprite, jumpSprite];
    let currentSprite = idleSprite;

    const player = new GameObject({
      width: walkingSprite.width,
      height: walkingSprite.height,
      anchor: [0.5, 1],
      x: renderer.width * 0.2,
      y: FLOOR,
      renderer,
      update(dt) {
        const onFloor = player.y + player.height * 0.5 >= FLOOR;
        const floorSpeed = 0.8;
        const airSpeed = 1;
        const jumpSpeed = 5;
        const gravity = jumpSpeed * 0.15;

        const speed = onFloor ? floorSpeed : airSpeed;

        const acceleration = new Vector();
        if (keyboard.isPressed('a')) {
          acceleration.x = -speed;
        }
        if (keyboard.isPressed('d')) {
          acceleration.x = speed;
        }
        if (keyboard.isPressed('space') && onFloor) {
          acceleration.y = -jumpSpeed;
        }

        if (acceleration.x > 0) {
          directionForwards = true;
        } else if (acceleration.x < 0) {
          directionForwards = false;
        }

        // add drag
        acceleration.x = acceleration.x + player.vx * -0.15;
        // add gravity
        acceleration.y += gravity;

        player.velocity.add(acceleration);
        // reset velocity when below threshold.
        if (Math.abs(player.vx) < 0.05) {
          player.vx = 0;
        }
        player.position.add(player.velocity);

        // clamp position
        if (player.x + player.width * player.anchor.x < 0) {
          player.x = renderer.width + player.width * 0.5;
        } else if (player.x > renderer.width + player.width * player.anchor.x) {
          player.x = player.width * -0.5;
        }
        if (player.y > FLOOR) {
          player.y = FLOOR;
          player.vy = 0;
        } else if (player.y < 0) {
          player.y = 0;
        }

        const currentSpeed = Math.min(2, Math.abs(player.vx) * 0.3);

        if (player.y < FLOOR) {
          currentSprite = jumpSprite;
        } else if (Math.abs(player.vx) > 0.5) {
          currentSprite = walkingSprite;
        } else {
          currentSprite = idleSprite;
        }
        for (const sprite of sprites) {
          if (sprite !== currentSprite) {
            sprite.resetTime();
          } else {
            if (sprite === jumpSprite) {
              sprite.update(dt);
            } else {
              sprite.update(dt * currentSpeed);
            }
          }
        }
      },
      render(renderer) {
        currentSprite.render(renderer, !directionForwards);
      },
    });

    return player;
  }

  const player = await createPlayer();

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
