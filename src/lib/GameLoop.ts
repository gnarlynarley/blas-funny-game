type GameLoopOptions = {
  update: (dt: number) => void;
  render: () => void;
};

export default class GameLoop {
  private update: (dt: number) => void;
  private render: () => void;
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private accumulator: number = 0;

  constructor({ update, render }: GameLoopOptions) {
    this.update = update;
    this.render = render;
  }

  start() {
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private loop() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const fps = 60;
    const frameDuration = 1000 / fps;
    this.accumulator += deltaTime;

    while (this.accumulator >= frameDuration) {
      this.update(deltaTime);
      this.accumulator -= frameDuration;
    }
    this.render();

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }
}
