const KEY_MAP: Record<string, string> = {
  ' ': 'space',
};

export default class Keyboard {
  #keysPressed = new Set<string>();

  constructor() {
    window.addEventListener('keydown', ({ key }) => {
      this.#keysPressed.add(KEY_MAP[key] ?? key.toLowerCase());
    });
    window.addEventListener('keyup', ({ key }) => {
      this.#keysPressed.delete(KEY_MAP[key] ?? key.toLowerCase());
    });
  }

  isPressed = (key: string): boolean => {
    return this.#keysPressed.has(key);
  };
}
