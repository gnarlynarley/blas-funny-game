import noop from './noop';
import Renderer from './Renderer';
import Vector from './Vector';

type Anchor = { x: number; y: number };
type GameObjectOptions = {
  renderer: Renderer;
  width: number;
  height: number;
  x?: number;
  y?: number;
  position?: Vector;
  vx?: number;
  vy?: number;
  velocity?: Vector;
  update?: (dt: number) => void;
  render?: (renderer: Renderer) => void;
  anchor?: [number, number];
};

export default class GameObject {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  position: Vector;
  velocity: Vector;
  anchor: Anchor;
  update: (dt: number) => void;
  #render: (renderer: Renderer) => void;

  constructor({
    width,
    height,
    x,
    y,
    position,
    vx,
    vy,
    velocity,
    anchor,
    update,
    render,
    renderer: { context },
  }: GameObjectOptions) {
    this.width = width;
    this.height = height;
    this.context = context;
    this.position = position ?? new Vector(x, y);
    this.velocity = velocity ?? new Vector(vx, vy);
    this.anchor = { x: anchor?.[0] ?? 0, y: anchor?.[1] ?? 0 };
    this.update = update ?? noop;
    this.#render = render ?? noop;
  }

  render = (renderer: Renderer) => {
    const {
      context,
      position: { x, y },
      width,
      height,
      anchor,
    } = this;

    context.save();
    if (this.flipRender) {
      context.scale(-1, 1);
      context.translate(width * -1, 0);
    }
    context.translate(
      Math.round(x - anchor.x * width),
      Math.round(y - anchor.y * height)
    );
    this.#render(renderer);
    context.restore();
  };

  flipRender = false;

  get x() {
    return this.position.x;
  }
  set x(value: number) {
    this.position.x = value;
  }

  get y() {
    return this.position.y;
  }
  set y(value: number) {
    this.position.y = value;
  }

  get vx() {
    return this.velocity.x;
  }
  set vx(value: number) {
    this.velocity.x = value;
  }

  get vy() {
    return this.velocity.y;
  }
  set vy(value: number) {
    this.velocity.y = value;
  }
}
