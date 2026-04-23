export const TILE_SIZE = 16;
export const LOGICAL_WIDTH = 400;
export const LOGICAL_HEIGHT = 224;

export const KEYS = {
  up: false,
  down: false,
  left: false,
  right: false,
  jump: false,
  shoot: false,
};

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' || e.code === 'KeyW') KEYS.up = true;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') KEYS.down = true;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') KEYS.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') KEYS.right = true;
  if (e.code === 'Space' || e.code === 'KeyZ') KEYS.jump = true;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyX' || e.code === 'KeyE') KEYS.shoot = true;
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp' || e.code === 'KeyW') KEYS.up = false;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') KEYS.down = false;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') KEYS.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') KEYS.right = false;
  if (e.code === 'Space' || e.code === 'KeyZ') KEYS.jump = false;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyX' || e.code === 'KeyE') KEYS.shoot = false;
});
