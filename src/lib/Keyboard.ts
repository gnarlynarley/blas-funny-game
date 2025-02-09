const KEY_MAP: Record<string, string> = {
  " ": "space",
};

export default class Keyboard {
  #keysPressed = new Set<string>();

  constructor() {
    window.addEventListener("keydown", ({ key }) => {
      this.#keysPressed.add(this.#normalizeKey(key));
    });
    window.addEventListener("keyup", ({ key }) => {
      this.#keysPressed.delete(this.#normalizeKey(key));
    });
  }

  #normalizeKey = (key: string) => KEY_MAP[key] ?? key.toLowerCase();

  isPressed = (key: string): boolean => {
    return this.#keysPressed.has(key);
  };
}
