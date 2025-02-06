import AnimationSprite from './lib/AnimationSprite';
import GameObject from './lib/GameObject';
import Vector from './lib/Vector';
import walkingSpriteSrc from './sprites/ristarwalkingfinal.png';
import idleSpriteSrc from './sprites/ristaridle.png';
import jumpSpriteSrc from './sprites/ristarjumpingsprite.png';
import dashSpriteSrc from './sprites/meteorstrikefinal.png';
import Renderer from './lib/Renderer';
import Keyboard from './lib/Keyboard';

const KEYBOARD_CONTROLS = {
  moveLeft: 'a',
  moveRight: 'd',
  jump: 'space',
  dash: 'l',
};
type PlayerAction =
  | {
      type: 'controlled';
    }
  | {
      type: 'dash';
      direction: 'left' | 'right';
      elapsed: number;
    };

export async function createPlayer({
  keyboard,
  renderer,
  initialX,
  initialY,
}: {
  renderer: Renderer;
  keyboard: Keyboard;
  initialX: number;
  initialY: number;
}) {
  let directionForwards = true;
  let action: PlayerAction = {
    type: 'controlled',
  };

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
  const dashSprite = await AnimationSprite.fromSrc({
    src: dashSpriteSrc,
    frames: 3,
    gap: 1,
    padding: 1,
    fps: 24,
    offsetX: 1,
    offsetY: 1,
  });

  const sprites = [walkingSprite, idleSprite, jumpSprite, dashSprite];
  const fixedSpeedSprites = [jumpSprite, dashSprite];
  let currentSprite = idleSprite;

  const player = new GameObject({
    width: walkingSprite.width,
    height: walkingSprite.height,
    anchor: [0.5, 1],
    x: initialX,
    y: initialY,
    renderer,
    update(dt) {
      const onFloor = player.y + player.height * 0.5 >= initialY;
      const floorSpeed = 0.8;
      const airSpeed = 1;
      const jumpSpeed = 5;
      const gravity = jumpSpeed * 0.15;
      const dashDuration = 100;
      const dashSpeed = 14;

      const speed = onFloor ? floorSpeed : airSpeed;

      const acceleration = new Vector();
      if (action.type === 'controlled') {
        if (keyboard.isPressed(KEYBOARD_CONTROLS.moveLeft)) {
          acceleration.x = -speed;
        }
        if (keyboard.isPressed(KEYBOARD_CONTROLS.moveRight)) {
          acceleration.x = speed;
        }
        if (keyboard.isPressed(KEYBOARD_CONTROLS.jump) && onFloor) {
          acceleration.y = -jumpSpeed;
        }
        // set the direction after the player input is done.
        if (acceleration.x > 0) {
          directionForwards = true;
        } else if (acceleration.x < 0) {
          directionForwards = false;
        }

        if (keyboard.isPressed(KEYBOARD_CONTROLS.dash)) {
          action = {
            type: 'dash',
            direction: directionForwards ? 'right' : 'left',
            elapsed: dashDuration,
          };
        }
      }

      if (action.type === 'dash') {
        action.elapsed -= dt;
        if (
          action.elapsed <= 0 &&
          !keyboard.isPressed(KEYBOARD_CONTROLS.dash)
        ) {
          action = { type: 'controlled' };
        } else {
          // reset velocity.
          player.velocity.x = 0;
          player.velocity.y = 0;

          acceleration.x =
            action.direction === 'right' ? dashSpeed : -dashSpeed;
        }
      } else {
        // add drag
        acceleration.x = acceleration.x + player.vx * -0.15;
        // add gravity
        acceleration.y += gravity;
      }

      // add acceleration and velocity to position.
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
      if (player.y > initialY) {
        player.y = initialY;
        player.vy = 0;
      } else if (player.y < 0) {
        player.y = 0;
      }

      const currentSpeed = Math.min(2, Math.abs(player.vx) * 0.3);

      if (action.type === 'dash') {
        currentSprite = dashSprite;
      } else {
        if (player.y < initialY) {
          currentSprite = jumpSprite;
        } else if (Math.abs(player.vx) > 0.5) {
          currentSprite = walkingSprite;
        } else {
          currentSprite = idleSprite;
        }
      }
      for (const sprite of sprites) {
        if (sprite !== currentSprite) {
          sprite.resetTime();
        } else {
          if (fixedSpeedSprites.includes(sprite)) {
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
