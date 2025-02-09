export type RendererOptions = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
};

export default class Renderer {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;

  constructor({ canvas, width, height }: RendererOptions) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.context = canvas.getContext("2d")!;
    if (this.context === null) throw new Error("Unable to get Canvas Context.");
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear = () => {
    this.context.clearRect(0, 0, this.width, this.height);
  };
}
