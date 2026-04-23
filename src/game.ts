import { KEYS, LOGICAL_WIDTH, LOGICAL_HEIGHT, TILE_SIZE } from './input';
import { getSpriteCanvas } from './sprites';
import { parseLevel, Block, Deco, Enemy, LEVELS } from './level';

interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  onGround: boolean;
  facingRight: boolean;
  state: 'idle' | 'run' | 'jump' | 'climb' | 'slide' | 'wallSlide';
  animTimer: number;
  dead: boolean;
  score: number;
  levelScore: number;
  won: boolean;
  pipeEntering?: boolean;
  wallDir: number;
  powerup: 'none' | 'fire' | 'cat' | 'wing';
  powerupTimer: number;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}

export class Game {
  player: Player;
  blocks: Block[];
  decos: Deco[];
  enemies: Enemy[];
  projectiles: Projectile[] = [];
  levelWidth: number;
  levelHeight: number;
  cameraX: number = 0;
  globalTime: number = 0;
  levelIndex: number = 0;
  gameBeaten: boolean = false;
  prevJump: boolean = false;
  prevShoot: boolean = false;
  playerProjectiles: Projectile[] = [];
  
  // physics constants
  gravity = 0.4;
  jumpForce = -6.2;
  moveSpeed = 1.35;
  maxFallSpeed = 8;
  friction = 0.8;
  acceleration = 0.3;

  constructor() {
    this.player = this.createDefaultPlayer();
    this.blocks = [];
    this.decos = [];
    this.enemies = [];
    this.levelWidth = 0;
    this.levelHeight = 0;
    
    this.loadLevel();
  }

  createDefaultPlayer(): Player {
    return {
      x: 16,
      y: 100,
      vx: 0,
      vy: 0,
      width: 12,
      height: 16,
      onGround: false,
      facingRight: true,
      state: 'idle',
      animTimer: 0,
      dead: false,
      score: 0,
      levelScore: 0,
      won: false,
      wallDir: 0,
      powerup: 'none',
      powerupTimer: 0,
    };
  }

  loadLevel() {
    const level = parseLevel(this.levelIndex);
    this.blocks = level.blocks;
    this.decos = level.decos;
    this.enemies = level.enemies;
    this.projectiles = [];
    this.levelWidth = level.width;
    this.levelHeight = level.height;
  }

  reset(hard = false) {
    let oldScore = this.player.score;
    this.player = this.createDefaultPlayer();
    this.player.score = oldScore; // preserve score by default
    
    if (hard) {
      this.levelIndex = 0;
      this.player.score = 0;
      this.gameBeaten = false;
    }
    
    this.loadLevel();
    this.cameraX = 0;
  }

  update(dt: number) {
    this.globalTime += dt;

    if (this.gameBeaten) return;
    if (this.player.dead || this.player.won) return;

    if (this.player.pipeEntering) {
      this.player.y += 1; // slide down pipe
      return;
    }

    if (this.player.powerupTimer > 0) {
      this.player.powerupTimer -= dt;
    } else if (this.player.powerup !== 'none') {
      this.player.powerup = 'none';
    }

    // Check vine overlap
    let touchingVine = this.blocks.some(b => b.type === 'vine' && this.checkCollisionAABB(this.player, b));

    if (this.player.state === 'climb' && !touchingVine) {
       this.player.state = 'jump';
    }

    if (touchingVine && (KEYS.up || KEYS.down)) {
       this.player.state = 'climb';
    }

    if (this.player.state === 'climb') {
      this.player.vy = 0;
      if (KEYS.up) this.player.vy = -1.5;
      else if (KEYS.down) this.player.vy = 1.5;

      if (KEYS.left) { this.player.vx = -1.5; this.player.facingRight = false; }
      else if (KEYS.right) { this.player.vx = 1.5; this.player.facingRight = true; }
      else this.player.vx = 0;

      if (KEYS.jump) {
         this.player.state = 'jump';
         this.player.vy = this.jumpForce;
      }
      
      if (Math.abs(this.player.vx) > 0.1 || Math.abs(this.player.vy) > 0.1) {
         this.player.animTimer += dt;
      }
    } else {
      // horizontal movement
      if (KEYS.left) {
        this.player.vx -= this.acceleration;
        this.player.facingRight = false;
      } else if (KEYS.right) {
        this.player.vx += this.acceleration;
        this.player.facingRight = true;
      } else {
        this.player.vx *= this.friction; // apply friction
      }

      // limit speed
      if (this.player.vx > this.moveSpeed) this.player.vx = this.moveSpeed;
      if (this.player.vx < -this.moveSpeed) this.player.vx = -this.moveSpeed;
      
      if (Math.abs(this.player.vx) < 0.1) this.player.vx = 0;

      // Jumping
      if (KEYS.jump && !this.prevJump) {
        if (this.player.onGround) {
          this.player.vy = this.jumpForce;
          this.player.onGround = false;
        } else if (this.player.wallDir !== 0) {
          this.player.vy = this.jumpForce * 0.9;
          this.player.vx = -this.player.wallDir * this.moveSpeed * 1.5;
          this.player.facingRight = this.player.wallDir === -1;
          this.player.wallDir = 0;
        }
      }

      // Handle platforms and wind
      for (const b of this.blocks) {
        if (b.type === 'moving_h') {
          b.x += b.vx || 0;
          if (Math.abs(b.x - (b.startX || 0)) > 64) {
             b.vx = -(b.vx || 0);
          }
          if (!this.player.dead && this.checkCollisionAABB(this.player, {...b, y: b.y - 2, height: b.height + 2}) && this.player.vy >= 0 && this.player.y + this.player.height <= b.y + 6) {
             this.player.x += b.vx || 0;
          }
        } else if (b.type === 'moving_v') {
          b.y += b.vy || 0;
          if (Math.abs(b.y - (b.startY || 0)) > 64) {
             b.vy = -(b.vy || 0);
          }
          if (!this.player.dead && this.checkCollisionAABB(this.player, {...b, y: b.y - 4, height: b.height + 4}) && this.player.vy >= 0 && this.player.y + this.player.height <= b.y + 8) {
             this.player.y += b.vy || 0;
             this.player.vy = 0;
             this.player.onGround = true;
          }
        }
      }

      let touchingWind = this.blocks.some(b => b.type === 'fan_wind' && this.checkCollisionAABB(this.player, b));
      if (touchingWind) {
        this.player.vy -= 0.8; 
        if (this.player.vy < -4.5) this.player.vy = -4.5;
      }

      // Apply gravity and fall logic
      let currentGravity = this.gravity;
      // Wing Suit glide
      if (this.player.powerup === 'wing' && KEYS.jump && this.player.vy > 0) {
        currentGravity = 0.05;
        if (this.player.vy > 1.5) this.player.vy = 1.5;
      }
      this.player.vy += currentGravity;
      
      // Wall slide logic
      let isWallSliding = false;
      if (this.player.wallDir !== 0 && ((KEYS.left && this.player.wallDir === -1) || (KEYS.right && this.player.wallDir === 1))) {
         if (this.player.powerup === 'cat' && KEYS.up) {
            this.player.vy = -2.5; // Cat climb
            isWallSliding = true;
         } else if (this.player.vy > 0) {
            if (this.player.vy > 1.5) this.player.vy = 1.5;
            isWallSliding = true;
         }
         this.player.facingRight = this.player.wallDir === 1;
      } else if (this.player.vy > this.maxFallSpeed) {
         this.player.vy = this.maxFallSpeed;
      }

      // Fire powerup logic
      if (KEYS.shoot && !this.prevShoot && this.player.powerup === 'fire' && this.player.powerupTimer > 0) {
        this.playerProjectiles.push({
          x: this.player.facingRight ? this.player.x + this.player.width : this.player.x - 8,
          y: this.player.y + 4,
          vx: this.player.facingRight ? 4 : -4,
          vy: 0,
          width: 8,
          height: 8
        });
      }

      // Animation state
      if (isWallSliding) {
         this.player.state = 'wallSlide';
      } else if (!this.player.onGround) {
        this.player.state = 'jump';
      } else if (Math.abs(this.player.vx) > 0.5 && ((KEYS.left && this.player.vx > 0) || (KEYS.right && this.player.vx < 0))) {
        this.player.state = 'slide';
      } else if (Math.abs(this.player.vx) > 0.1) {
        this.player.state = 'run';
        this.player.animTimer += dt;
      } else {
        this.player.state = 'idle';
        this.player.animTimer = 0;
      }
    }

    // Apply movement and resolve collisions horizontally
    this.player.wallDir = 0; // reset before check
    this.player.x += this.player.vx;
    this.resolveCollisions(true);

    // Apply movement and resolve collisions vertically
    this.player.y += this.player.vy;
    this.player.onGround = false;
    this.resolveCollisions(false);

    // Keep in bounds
    if (this.player.x < 0) {
      this.player.x = 0;
      this.player.vx = 0;
    }
    if (this.player.x > this.levelWidth - this.player.width) {
      this.player.x = this.levelWidth - this.player.width;
      this.player.vx = 0;
    }
    
    // Death by pit
    if (this.player.y > this.levelHeight + 50) {
      this.player.dead = true;
      setTimeout(() => this.reset(false), 1000);
    }

    // Update Enemies
    for (const enemy of this.enemies) {
      if (enemy.dead) continue;
      
      if (enemy.type === 'goomba') {
        enemy.vy += this.gravity;
        enemy.x += enemy.vx;
        
        let hitWall = false;
        
        // Simple enemy collision (ground and walls)
        for (const b of this.blocks) {
          if (b.type !== 'solid' && b.type !== 'brick' && b.type !== 'ground' && b.type !== 'question') continue;
          
          if (enemy.x < b.x + b.width && enemy.x + enemy.width > b.x && enemy.y < b.y + b.height && enemy.y + enemy.height > b.y) {
            enemy.x -= enemy.vx;
            enemy.vx = -enemy.vx;
            hitWall = true;
            break;
          }
        }
        
        enemy.y += enemy.vy;
        for (const b of this.blocks) {
          if (b.type !== 'solid' && b.type !== 'brick' && b.type !== 'ground' && b.type !== 'question') continue;
          
          if (enemy.x < b.x + b.width && enemy.x + enemy.width > b.x && enemy.y < b.y + b.height && enemy.y + enemy.height > b.y) {
            enemy.y = b.y - enemy.height;
            enemy.vy = 0;
            break;
          }
        }
      } else if (enemy.type === 'jumper') {
        enemy.vy += this.gravity;
        enemy.y += enemy.vy;
        let hitGround = false;
        for (const b of this.blocks) {
          if (b.type !== 'solid' && b.type !== 'brick' && b.type !== 'ground' && b.type !== 'question') continue;
          if (this.checkCollisionAABB(enemy, b)) {
            if (enemy.vy > 0) {
              enemy.y = b.y - enemy.height;
              enemy.vy = 0;
              hitGround = true;
            }
          }
        }
        enemy.timer = (enemy.timer || 0) + dt;
        if (hitGround && enemy.timer > 60) {
           enemy.vy = this.jumpForce * 0.9;
           enemy.timer = 0;
        }
      } else if (enemy.type === 'shooter') {
        enemy.vy += this.gravity;
        enemy.y += enemy.vy;
        for (const b of this.blocks) {
          if (b.type !== 'solid' && b.type !== 'brick' && b.type !== 'ground' && b.type !== 'question') continue;
          if (this.checkCollisionAABB(enemy, b)) {
            if (enemy.vy > 0) {
               enemy.y = b.y - enemy.height;
               enemy.vy = 0;
            }
          }
        }
        enemy.timer = (enemy.timer || 0) + dt;
        const distToPlayer = this.player.x - enemy.x;
        if (enemy.timer > 120 && Math.abs(distToPlayer) < 300) {
           enemy.timer = 0;
           this.projectiles.push({
             x: distToPlayer > 0 ? enemy.x + enemy.width : enemy.x - 8,
             y: enemy.y + 4,
             vx: distToPlayer > 0 ? 2 : -2,
             vy: 0,
             width: 8,
             height: 8
           });
        }
      }

      // Check player collision
      if (this.checkCollisionAABB(this.player, enemy)) {
        if (this.player.vy > 0 && this.player.y < enemy.y + 5) {
          // Bounced on top
          enemy.dead = true;
          this.player.vy = this.jumpForce * 0.8; // mini jump off enemy
          this.player.levelScore += 500;
        } else {
          // Hit from side
          this.player.dead = true;
          setTimeout(() => this.reset(false), 1000);
        }
      }
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      
      if (this.checkCollisionAABB(this.player, p)) {
         this.player.dead = true;
         setTimeout(() => this.reset(false), 1000);
         this.projectiles.splice(i, 1);
         continue;
      }
      
      let hit = false;
      for (const b of this.blocks) {
         if (b.type !== 'solid' && b.type !== 'brick' && b.type !== 'ground' && b.type !== 'question') continue;
         if (this.checkCollisionAABB(p, b)) hit = true;
      }
      if (hit || p.x < this.cameraX || p.x > this.cameraX + LOGICAL_WIDTH) {
         this.projectiles.splice(i, 1);
      }
    }

    // Update camera
    const cameraTargetX = this.player.x - LOGICAL_WIDTH / 2 + this.player.width / 2;
    this.cameraX = Math.max(0, Math.min(cameraTargetX, this.levelWidth - LOGICAL_WIDTH));
    
    this.prevJump = KEYS.jump;
    this.prevShoot = KEYS.shoot;
  }

  checkCollisionAABB(rect1: {x: number, y: number, width: number, height: number}, rect2: {x: number, y: number, width: number, height: number}) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  resolveCollisions(horizontal: boolean) {
    const px = this.player.x;
    const py = this.player.y;
    const pw = this.player.width;
    const ph = this.player.height;

    for (const b of this.blocks) {
      if (b.collected) continue;
      
      const bx = b.x;
      const by = b.y;
      const bw = b.width;
      const bh = b.height;

      // AABB Collision
      if (px < bx + bw && px + pw > bx && py < by + bh && py + ph > by) {
        
        // Check hazards / collectibles
        if (b.type === 'spike') {
          this.player.dead = true;
          setTimeout(() => this.reset(false), 1000);
          return;
        }
        if (b.type === 'coin') {
          b.collected = true;
          this.player.levelScore += 100;
          continue;
        }

        if (b.type === 'powerup_fire' || b.type === 'powerup_cat' || b.type === 'powerup_wing') {
          b.collected = true;
          if (b.type === 'powerup_fire') this.player.powerup = 'fire';
          if (b.type === 'powerup_cat') this.player.powerup = 'cat';
          if (b.type === 'powerup_wing') this.player.powerup = 'wing';
          this.player.powerupTimer = 60 * 15; // roughly 15s
          this.player.levelScore += 200;
          continue;
        }

        const isSolid = b.type === 'solid' || b.type === 'brick' || b.type === 'ground' || b.type === 'question' || b.type === 'fan' || b.type === 'moving_h' || b.type === 'moving_v' || b.type === 'jump_pad' || b.type === 'pipe_body' || b.type === 'pipe_top' || b.type === 'pipe_end_top' || b.type === 'pipe_end_body';

        if (isSolid) {
          if (horizontal) {
            if (b.type === 'moving_h' || b.type === 'moving_v' || b.type === 'jump_pad') continue;

            if (this.player.vx > 0) { // moving right
              this.player.x = bx - pw;
              this.player.vx = 0;
              this.player.wallDir = 1;
            } else if (this.player.vx < 0) { // moving left
              this.player.x = bx + bw;
              this.player.vx = 0;
              this.player.wallDir = -1;
            }
          } else {
            if (this.player.vy > 0) { // falling down
              this.player.y = by - ph;
              if (b.type === 'jump_pad') {
                this.player.vy = -12; // super bounce!
                b.timer = 10; // set timer for animation
                this.player.onGround = false;
              } else if (b.type === 'pipe_end_top') {
                // Enter pipe
                if (!this.player.pipeEntering) {
                  this.player.pipeEntering = true;
                  this.player.levelScore += 1000;
                  this.player.score += this.player.levelScore;
                  this.player.vx = 0;
                  this.player.vy = 0;
                  this.player.x = b.x + b.width / 2 - this.player.width / 2;
                  setTimeout(() => {
                    if (this.levelIndex < LEVELS.length - 1) {
                      this.levelIndex++;
                      this.reset(false);
                    } else {
                      this.gameBeaten = true;
                    }
                  }, 2000);
                }
              } else {
                this.player.vy = 0;
                this.player.onGround = true;
              }
            } else if (this.player.vy < 0) { // jumping up, hit head
              if (b.type === 'moving_h' || b.type === 'moving_v' || b.type === 'jump_pad') continue;

              this.player.y = by + bh;
              this.player.vy = 0;
              if (b.type === 'question') {
                b.type = 'solid'; // empty question block
                this.player.levelScore += 50;
                
                const r = Math.random();
                let spawnType: BlockType = 'coin';
                if (r < 0.1) spawnType = 'powerup_fire';
                else if (r < 0.2) spawnType = 'powerup_cat';
                else if (r < 0.3) spawnType = 'powerup_wing';
                
                this.blocks.push({
                   type: spawnType,
                   x: b.x,
                   y: b.y - b.height,
                   width: b.width,
                   height: b.height
                });
              }
            }
          }
        }
      }
    }
  }

  getTheme(): string {
    const themes = ['overworld', 'underground', 'snow'];
    return themes[this.levelIndex % themes.length];
  }

  draw(ctx: CanvasRenderingContext2D) {
    const theme = this.getTheme();
    // Clear background
    if (theme === 'underground') {
      ctx.fillStyle = '#000000';
    } else {
      ctx.fillStyle = '#5c94fc';
    }
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    ctx.save();
    ctx.translate(-Math.floor(this.cameraX), 0);

    // Draw Decos (background)
    for (const deco of this.decos) {
      if (deco.x + 80 < this.cameraX || deco.x > this.cameraX + LOGICAL_WIDTH) continue;
      const sprite = getSpriteCanvas(deco.type, false, theme);
      ctx.drawImage(sprite, deco.x, deco.y - (sprite.height - TILE_SIZE));
    }

    // Draw Blocks
    for (const b of this.blocks) {
      if (b.collected) continue;
      if (b.x + b.width < this.cameraX || b.x > this.cameraX + LOGICAL_WIDTH) continue;

      if (b.type === 'ground' || b.type === 'brick') {
        const sprite = getSpriteCanvas('brick', false, theme);
        ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      } else if (b.type === 'question') {
        const sprite = getSpriteCanvas('question', false, theme);
        ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      } else if (b.type === 'solid' || b.type === 'empty') {
        const sprite = getSpriteCanvas('solid', false, theme);
        ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      } else if (b.type === 'spike') {
        const sprite = getSpriteCanvas('spike', false, theme);
        ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      } else if (b.type === 'pipe_top' || b.type === 'pipe_end_top') {
        const p_w = b.width;
        const p_h = b.height;
        ctx.fillStyle = '#000000';
        ctx.fillRect(b.x, b.y, p_w, p_h);
        ctx.fillStyle = '#00aa00';
        ctx.fillRect(b.x + 1, b.y + 1, p_w - 2, p_h - 2);
        ctx.fillStyle = '#55ff55';
        ctx.fillRect(b.x + 3, b.y + 1, 4, p_h - 2);
      } else if (b.type === 'pipe_body' || b.type === 'pipe_end_body') {
        const p_w = b.width;
        const p_h = b.height;
        const inset = 2;
        ctx.fillStyle = '#000000';
        ctx.fillRect(b.x + inset, b.y, p_w - inset*2, p_h);
        ctx.fillStyle = '#00aa00';
        ctx.fillRect(b.x + inset + 1, b.y, p_w - inset*2 - 2, p_h);
        ctx.fillStyle = '#55ff55';
        ctx.fillRect(b.x + inset + 3, b.y, 4, p_h);
      } else if (b.type === 'vine') {
        const sprite = getSpriteCanvas('vine', false, theme);
        ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      } else if (b.type === 'coin') {
         const coinFrames = ['coin1', 'coin2', 'coin3', 'coin2'];
         const animFrame = coinFrames[Math.floor(this.globalTime / 15) % coinFrames.length];
         const sprite = getSpriteCanvas(animFrame, false, theme);
         ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      } else if (b.type === 'moving_h' || b.type === 'moving_v') {
        ctx.fillStyle = '#ff8800'; // Orange theme for platforms
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x + 2, b.y + 2, b.width - 4, b.height - 4);
      } else if (b.type === 'fan') {
        ctx.fillStyle = '#666666';
        ctx.fillRect(b.x, b.y + 8, b.width, 8); // TILE_SIZE/2 base
        ctx.fillStyle = '#999999';
        const fanOffset = (Date.now() / 50) % 8;
        ctx.fillRect(b.x + fanOffset, b.y + 8, b.width / 2, 8);
      } else if (b.type === 'fan_wind') {
        ctx.fillStyle = 'rgba(200, 240, 255, 0.3)';
        const drift = Math.sin((Date.now() / 200) + (b.y / 10)) * 3;
        ctx.fillRect(b.x + 2 + drift, b.y, b.width - 4, b.height);
      } else if (b.type === 'jump_pad') {
        // Handle animation
        if (b.timer && b.timer > 0) {
           b.timer -= 1;
        }
        const squish = (b.timer && b.timer > 0) ? b.timer : 0;
        
        ctx.fillStyle = '#00cc44'; // Green base
        ctx.fillRect(b.x + 2, b.y + squish, b.width - 4, b.height - squish);
        
        ctx.fillStyle = '#ffff00'; // Yellow bouncy top
        ctx.fillRect(b.x, b.y + squish, b.width, 4);
      } else if (b.type === 'powerup_fire') {
        const sprite = getSpriteCanvas('powerup_mushroom', false, theme);
        ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      } else if (b.type === 'powerup_cat') {
        const sprite = getSpriteCanvas('powerup_star', false, theme);
        ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      } else if (b.type === 'powerup_wing') {
        const sprite = getSpriteCanvas('powerup_mushroom', false, theme);
        ctx.drawImage(sprite, b.x, b.y, b.width, b.height);
      }
    }

    // Draw Enemies
    for (const enemy of this.enemies) {
      if (enemy.dead) continue;
      if (enemy.x + enemy.width < this.cameraX || enemy.x > this.cameraX + LOGICAL_WIDTH) continue;

      const isWalk2 = Math.floor(this.globalTime / 15) % 2 === 0;
      let spriteName = isWalk2 ? 'goomba2' : 'goomba1';
      const sprite = getSpriteCanvas(spriteName, false, theme);
      
      ctx.save();
      if (enemy.type === 'jumper') {
         ctx.filter = 'hue-rotate(180deg)';
      } else if (enemy.type === 'shooter') {
         ctx.filter = 'hue-rotate(90deg)';
      }
      ctx.drawImage(sprite, Math.floor(enemy.x), Math.floor(enemy.y));
      ctx.restore();
    }

    // Draw Projectiles
    ctx.fillStyle = '#ff4444';
    for (const p of this.projectiles) {
        ctx.beginPath();
        ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw Player Projectiles (Fireballs)
    ctx.fillStyle = '#ff8800';
    for (const p of this.playerProjectiles) {
        ctx.beginPath();
        ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/2, 0, Math.PI * 2);
        ctx.fill();
        // Inner yellow core
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff8800'; // restore
    }

    // Draw Player
    if (!this.player.dead) {
      let spriteName = 'marioIdle';
      if (this.gameBeaten || this.player.won) {
         spriteName = 'marioIdle'; 
      } else if (this.player.state === 'climb') {
         const isClimb2 = Math.floor(this.player.animTimer / 10) % 2 === 0;
         spriteName = isClimb2 ? 'marioClimb2' : 'marioClimb1';
      } else if (this.player.state === 'jump') {
        spriteName = 'marioJump';
      } else if (this.player.state === 'slide' || this.player.state === 'wallSlide') {
        spriteName = 'marioSlide';
      } else if (this.player.state === 'run') {
        const frames = ['marioRun1', 'marioRun2', 'marioRun3'];
        const frameIdx = Math.floor(this.player.animTimer / 6) % frames.length;
        spriteName = frames[frameIdx];
      }
      
      const spriteData = getSpriteCanvas(spriteName, !this.player.facingRight, theme);
      
      // Apply powerup skin filters
      if (this.player.powerup === 'fire') {
         ctx.filter = 'drop-shadow(0 0 4px #ff8800) hue-rotate(-30deg)';
      } else if (this.player.powerup === 'cat') {
         ctx.filter = 'drop-shadow(0 0 4px #ffff00) hue-rotate(60deg) brightness(1.2)';
      } else if (this.player.powerup === 'wing') {
         ctx.filter = 'drop-shadow(0 0 6px #88ccff) brightness(1.5)';
      }

      // Blink if near powerup fading
      if (this.player.powerupTimer > 0 && this.player.powerupTimer < 180) { // last 3 seconds
         if (Math.floor(this.globalTime / 10) % 2 === 0) {
             ctx.filter = 'none'; // clear filter
         }
      }

      ctx.drawImage(spriteData, Math.floor(this.player.x), Math.floor(this.player.y) - (spriteData.height - this.player.height));
      
      ctx.filter = 'none'; // reset filter
    }

    if (this.player.pipeEntering) {
       for(const b of this.blocks) {
         if (b.type === 'pipe_top' || b.type === 'pipe_body' || b.type === 'pipe_end_top' || b.type === 'pipe_end_body') {
            const isTop = b.type === 'pipe_top' || b.type === 'pipe_end_top';
            const p_w = b.width;
            const p_h = b.height;
            const inset = isTop ? 0 : 2;
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(b.x + inset, b.y, p_w - inset*2, p_h);
            ctx.fillStyle = '#00aa00';
            ctx.fillRect(b.x + inset + 1, b.y + (isTop?1:0), p_w - inset*2 - 2, p_h - (isTop?2:0));
            ctx.fillStyle = '#55ff55';
            ctx.fillRect(b.x + inset + 3, b.y + (isTop?1:0), 4, p_h - (isTop?2:0));
         }
       }
    }
    
    ctx.restore();

    // Draw UI HUD (in Game coords)
    ctx.fillStyle = 'white';
    ctx.font = '10px "Courier New", monospace';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    let timerStr = this.player.powerupTimer > 0 ? ` [${this.player.powerup.toUpperCase()}: ${Math.ceil(this.player.powerupTimer / 60)}s]` : '';
    ctx.fillText(`WORLD: ${this.levelIndex + 1}  LEVEL SCORE: ${this.player.levelScore}  TOTAL: ${this.player.score}${timerStr}`, 10, 10);
    if (this.gameBeaten) {
      ctx.fillStyle = '#24DB33';
      ctx.fillText(`YOU ARE A SUPER PLAYER! CONGRATULATIONS!`, LOGICAL_WIDTH / 2 - 120, LOGICAL_HEIGHT / 2);
    } else if (this.player.dead) {
      ctx.fillStyle = '#F8B800';
      ctx.fillText(`YOU DIED! RESPAWNING...`, LOGICAL_WIDTH / 2 - 60, LOGICAL_HEIGHT / 2);
    } else if (this.player.won || this.player.pipeEntering) {
      ctx.fillStyle = '#24DB33';
      ctx.fillText(`LEVEL COMPLETE!`, LOGICAL_WIDTH / 2 - 40, LOGICAL_HEIGHT / 2);
    }
    
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}
