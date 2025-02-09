import createImage from "./createImage";
import type Renderer from "./Renderer";

export type AnimationSpriteOptions = {
  image: HTMLImageElement;
  frames: number;
  gap: number;
  padding: number;
  fps: number;
  offsetX?: number;
  offsetY?: number;
  once?: boolean;
};
export type AnimationSpriteFromSrcOptions = { src: string } & Omit<
  AnimationSpriteOptions,
  "image"
>;

export default class AnimationSprite {
  image: HTMLImageElement;
  frames: number;
  gap: number;
  padding: number;
  width: number;
  height: number;
  currentTime: number = 0;
  fps: number;
  offsetX: number;
  offsetY: number;
  once: boolean;

  static async fromSrc({
    src,
    ...options
  }: AnimationSpriteFromSrcOptions): Promise<AnimationSprite> {
    const image = await createImage(src);

    return new AnimationSprite({ image, ...options });
  }

  constructor({
    image,
    frames,
    gap,
    padding,
    fps,
    offsetX,
    offsetY,
    once,
  }: AnimationSpriteOptions) {
    if (frames < 1) throw new Error("Frames cannot be lower than 1.");
    this.image = image;
    this.frames = frames;
    this.gap = gap;
    this.padding = padding;
    this.height = image.naturalHeight - gap * 2;
    this.width =
      (image.naturalWidth - gap * 2 - (frames - 1) * padding) / frames;
    this.fps = fps;
    this.offsetX = offsetX ?? 0;
    this.offsetY = offsetY ?? 0;
    this.once = once ?? false;
  }

  resetTime = () => {
    this.currentTime = 0;
  };

  update = (dt: number) => {
    const fullDuration = (1000 / this.fps) * this.frames;
    if (this.once) {
      this.currentTime = Math.min(
        fullDuration - 0.00001,
        this.currentTime + dt,
      );
    } else {
      this.currentTime = (this.currentTime + dt) % fullDuration;
    }
  };

  render = ({ context }: Renderer, flip = false) => {
    context.save();

    context.translate(this.offsetX, this.offsetY);
    if (flip) {
      context.translate(this.width, 0);
      context.scale(-1, 1);
      context.translate(-this.offsetX * 2, 0);
    }

    const frameIndex = Math.floor(
      (this.currentTime / (1000 / this.fps)) % this.frames,
    );
    context.drawImage(
      this.image,
      this.gap + (this.width + this.gap) * frameIndex,
      this.gap,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height,
    );

    context.restore();
  };
}
