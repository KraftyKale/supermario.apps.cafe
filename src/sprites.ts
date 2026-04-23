export const PALETTE: Record<string, string> = {
  '-': 'transparent',
  'R': '#d82800', // Red
  'B': '#f89850', // Skin/Peach
  'H': '#887000', // Hair/Boots/Brown
  'O': '#887000', // Overalls
  'W': '#ffffff', // White
  'K': '#000000', // Black
  'y': '#f8d820', // Yellow/Coin
  
  // Block Colors
  '1': '#c84c0c', // Dark brick shadow
  '2': '#f89850', // Light brick
  '3': '#887000', // Question block brown
  '4': '#000000', // Black outline
  
  // Scenery
  'G': '#00a800', // Green for hills/pipes
  'g': '#b8f818', // Light green
  'C': '#ffffff', // Cloud white
  'c': '#bcbcbc', // Cloud shadow
};

export const SPRITES: Record<string, string[]> = {
  marioIdle: [
    '----RRRR----',
    '---RRRRRRRR-',
    '---HHHBBH---',
    '--HBHBBBBB--',
    '--HBHBBBBB--',
    '--HHBBBB----',
    '----BBBBBBB-',
    '---RROOO----',
    '--RRROOORR--',
    '-RRRROOOORRR',
    'BBRRROOOORRB',
    'BBBBOOOOBBBB',
    '-BBHOOOOHBB-',
    '--HH----HH--',
    '--HHH--HHH--',
  ],
  marioRun1: [
    '----RRRR----',
    '---RRRRRRRR-',
    '---HHHBBH---',
    '--HBHBBBBB--',
    '--HBHBBBBB--',
    '--HHBBBB----',
    '----BBBBBBB-',
    '---RROOO----',
    '--RRROOORR--',
    '-RRRROOOORRR',
    'BBRRROOOO---',
    'BBBBOOOOHHH-',
    '-BBHOOOO----',
    '--HH--HHH---',
    '-------HHH--',
  ],
  marioRun2: [
    '----RRRR----',
    '---RRRRRRRR-',
    '---HHHBBH---',
    '--HBHBBBBB--',
    '--HBHBBBBB--',
    '--HHBBBB----',
    '----BBBBBBB-',
    '---RROOO----',
    '--RRROOORR--',
    '-RRRROOOORRR',
    'BBRRROOOORR-',
    'BBBBOOOOOBB-',
    '-BBHOOOOOO--',
    '--HH---HH---',
    '-HHH----HH--',
  ],
  marioRun3: [
    '----RRRR----',
    '---RRRRRRRR-',
    '---HHHBBH---',
    '--HBHBBBBB--',
    '--HBHBBBBB--',
    '--HHBBBB----',
    '----BBBBBBB-',
    '---RROOOR---',
    '--RRROOORR--',
    '-RRRROOOORRR',
    '--RRROOOORRB',
    '---BOOOOBBBB',
    '--HHOOOOHBB-',
    '--HH----HH--',
    '--HHH--HHH--',
  ],
  marioJump: [
    '----RRRR----',
    '---RRRRRRRR-',
    '---HHHBBH---',
    '--HBHBBBBB--',
    '--HBHBBBBB--',
    '--HHBBBB----',
    '----BBBBBBB-',
    '----ROOOR---',
    '---RRROORR--',
    '--RRROOOORRR',
    '--RRROOOORRB',
    '---BOOOOOOBB',
    '---HOOOOOO--',
    '--HH---HH---',
    '-HHH----HH--',
  ],

  marioSlide: [
    '-----RRRR---',
    '----RRRRRRRR',
    '----HHHBBH--',
    '---HBHBBBBB-',
    '---HBHBBBBB-',
    '---HHBBBB---',
    '-----BBBBBBB',
    '----ROOOR---',
    '---RRROORR--',
    '--RRROOOORRR',
    '--RRROOOORRB',
    '---BOOOOOOBB',
    '---HOOOOOO--',
    '-HHH---HH---',
    'HHH-----HH--',
  ],

  marioClimb1: [
    '----RRRR----',
    '---RRRRRRRR-',
    '---RHHHHHHR-',
    '---HBBBBBBH-',
    '---HBBBBBBH-',
    '----HBBBBH--',
    '--B-BBBBBB-B',
    '-BBRROOOORBB',
    '-RRROOOROOOR',
    'RRRROOOOOORR',
    'RRRROOOOOORR',
    'BBBBOOOOOBBB',
    'BBBBOOOOOBBB',
    '--HH----HH--',
    '--HHH--HHH--',
  ],

  marioClimb2: [
    '----RRRR----',
    '---RRRRRRRR-',
    '---RHHHHHHR-',
    '---HBBBBBBH-',
    '---HBBBBBBH-',
    '----HBBBBH--',
    '-B--BBBBBB-B',
    'BBR-ROOOORBB',
    'RRROOOOROOOR',
    'RRROOOOOORRR',
    'RRROOOOOORRR',
    'BBBOOOOOBBBB',
    'BBBOOOOOBBBB',
    '--HH----HH--',
    '--HHH--HHH--',
  ],

  vine: [
    '---GgG----GgG---',
    '----GgG--GgG----',
    '-----GgGGgG-----',
    '------GGGG------',
    '-------GG-------',
    '------GGGG------',
    '-----GgGGgG-----',
    '----GgG--GgG----',
    '---GgG----GgG---',
    '----GgG--GgG----',
    '-----GgGGgG-----',
    '------GGGG------',
    '-------GG-------',
    '------GGGG------',
    '-----GgGGgG-----',
    '----GgG--GgG----',
  ],

  brick: [
    '1111111111111111',
    '1222222122222221',
    '1222222122222221',
    '1222222122222221',
    '1111111111111111',
    '2221222222212222',
    '2221222222212222',
    '2221222222212222',
    '1111111111111111',
    '1222222122222221',
    '1222222122222221',
    '1222222122222221',
    '1111111111111111',
    '2221222222212222',
    '2221222222212222',
    '2221222222212222',
  ],

  question: [
    '3333333333333333',
    '3yyyyyyyyyyyyyy3',
    '3y333333333333y3',
    '3y3yyyyyyyyyy3y3',
    '3y3yy333333yy3y3',
    '3y3yy3yyyy3yy3y3',
    '3y3yy3yyyy3yy3y3',
    '3y3yyyyyy33yy3y3',
    '3y3yyyyy33yyy3y3',
    '3y3yyyyy3yyyy3y3',
    '3y3yyyyy3yyyy3y3',
    '3y3yyyyyyyyyy3y3',
    '3y3yyyyy3yyyy3y3',
    '3y333333333333y3',
    '3yyyyyyyyyyyyyy3',
    '3333333333333333',
  ],

  solid: [
    '1111111111111111',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1222222222222214',
    '1111111111111114',
    '4444444444444444',
    '4444444444444444',
  ],

  cloud: [
    '------------------------------------------------',
    '------------------CCCCCCCC----CCC---------------',
    '-----------CCCC---CCCCCCCC--CCCCCC--------------',
    '---------CCCCCC--CCCCCCCCCCCCCCCCCC-------------',
    '--------CCCCCCCCCCCCCCCCCCCCCCCCCCCC--CCC-------',
    '--CCC--CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC------',
    '-CCCCC-CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC-----',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC-----',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC-----',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC-----',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC-----',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC-----',
    '------------------------------------------------',
    '------------------------------------------------',
    '------------------------------------------------',
    '------------------------------------------------',
  ],

  hill_small: [
    '------------------------------------------------',
    '-----------------------G------------------------',
    '----------------------GgG-----------------------',
    '---------------------GgggG----------------------',
    '--------------------GgggggG---------------------',
    '-------------------GgggggggG--------------------',
    '------------------GgggggggggG-------------------',
    '-----------------GgggggggggggG------------------',
    '----------------GgggggggggggggG-----------------',
    '---------------GggggggKggggggggG----------------',
    '--------------GggggggKKKggggggggG---------------',
    '-------------GggggggggKggggggggggG--------------',
    '------------GgggggggggggggggggggggG-------------',
    '-----------GggggggggggggKggggggggggG------------',
    '----------GggggggggggggKKKggggggggggG-----------',
    '---------GggggggggggggggKggggggggggggG----------',
  ],

  hill_large: [
    '--------------------------------------------------------------------------------',
    '---------------------------------------G----------------------------------------',
    '--------------------------------------GgG---------------------------------------',
    '-------------------------------------GgggG--------------------------------------',
    '------------------------------------GgggggG-------------------------------------',
    '-----------------------------------GgggggggG------------------------------------',
    '----------------------------------GgggggggggG-----------------------------------',
    '---------------------------------GgggggggggggG----------------------------------',
    '--------------------------------GgggggggggggggG---------------------------------',
    '-------------------------------GgggggggggggggggG--------------------------------',
    '------------------------------GgggggggggggggggggG-------------------------------',
    '-----------------------------GgggggggggKgggggggggG------------------------------',
    '----------------------------GgggggggggKKKgggggggggG-----------------------------',
    '---------------------------GgggggggggggKgggggggggggG----------------------------',
    '--------------------------GgggggggggggggggggKgggggggG---------------------------',
    '-------------------------GgggggggggggggggggKKKgggggggG--------------------------',
  ],

  goomba1: [
    '----------------',
    '----------------',
    '----------------',
    '-------11-------',
    '------1111------',
    '-----111111-----',
    '----111K4111----',
    '---111K4K111---',
    '---111K4K111---',
    '--11111K411111--',
    '--111111111111--',
    '---1111111111---',
    '---4--4--4--4---',
    '--44--4--4--44--',
    '----------------',
    '----------------',
  ],
  goomba2: [
    '----------------',
    '----------------',
    '----------------',
    '-------11-------',
    '------1111------',
    '-----111111-----',
    '----111K4111----',
    '---111K4K111---',
    '---111K4K111---',
    '--11111K411111--',
    '--111111111111--',
    '---1111111111---',
    '--4---4--4---4--',
    '-44---4--4---44-',
    '----------------',
    '----------------',
  ],
  coin1: [
    '----yyyy----',
    '---y44y4y---',
    '--y4--y-4y--',
    '-y4---y--4y-',
    '-y4---y--4y-',
    '-y4---y--4y-',
    '-y4---y--4y-',
    '-y4---y--4y-',
    '-y4---y--4y-',
    '-y4---y--4y-',
    '--y4--y-4y--',
    '---y44y4y---',
    '----yyyy----',
    '------------',
    '------------',
    '------------',
  ],
  coin2: [
    '-----yy-----',
    '----y44y----',
    '---y4-y4y---',
    '--y4--y-4y--',
    '--y4--y-4y--',
    '--y4--y-4y--',
    '--y4--y-4y--',
    '--y4--y-4y--',
    '--y4--y-4y--',
    '--y4--y-4y--',
    '---y4-y4y---',
    '----y44y----',
    '-----yy-----',
    '------------',
    '------------',
    '------------',
  ],
  coin3: [
    '------y-----',
    '-----y4y----',
    '----y4y4y---',
    '----y4y4y---',
    '----y4y4y---',
    '----y4y4y---',
    '----y4y4y---',
    '----y4y4y---',
    '----y4y4y---',
    '----y4y4y---',
    '-----y4y----',
    '------y-----',
    '------------',
    '------------',
    '------------',
    '------------',
  ],
  spike: [
    '----------------',
    '---G--------G---',
    '--GGG------GGG--',
    '--GGG------GGG--',
    '-GG44G----GG44G-',
    '-G444G----G444G-',
    'G44444G--G44444G',
    'G44444G--G44444G',
    'GGGGGGG--GGGGGGG',
    'GGGGGGG--GGGGGGG',
    'GGGGGGG--GGGGGGG',
    'GGGGGGG--GGGGGGG',
    'GGGGGGG--GGGGGGG',
    'GGGGGGG--GGGGGGG',
    'GGGGGGGGGGGGGGGG',
    'GGGGGGGGGGGGGGGG',
  ],
  flagpole: [
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
    '-------33-------',
  ],
  flag: [
    '-------31-------',
    'y------31-------',
    'yy-----31-------',
    'yyy----31-------',
    'yyyy---31-------',
    'yyyyy--31-------',
    'yyyyyy-31-------',
    'yyyyyyy31-------',
    'yyyyyy-31-------',
    'yyyyy--31-------',
    'yyyy---31-------',
    'yyy----31-------',
    'yy-----31-------',
    'y------31-------',
    '-------31-------',
    '-------31-------',
  ],
  powerup_mushroom: [
    '------4444------',
    '----44RRRR44----',
    '---4RRWRRWWR4---',
    '--4RRWWWRWWWR4--',
    '-4RRRWWWRWWWRR4-',
    '-4RRRRWWWRRRRR4-',
    '4RRRWWWRRRWWWRR4',
    '4RRWWWRRRRWWWRR4',
    '4RRWWWRRRRWWWRR4',
    '-4RWWWRRRRWWWR4-',
    '-4RRWRRRRRWRR4-',
    '--44444444444--',
    '---4B4KBBK4B4---',
    '---4BBBBBBBB4---',
    '----44444444----',
    '----------------',
  ],

  powerup_star: [
    '-------44-------',
    '-------4y4------',
    '------4yyy4-----',
    '------4yyy4-----',
    '--4444yyyyy4444-',
    '-4yyyyyyyyyyyy4-',
    '--4K4yyyyyyy44--',
    '---4yy4Kyy4y4---',
    '----4y4yy4y4----',
    '---4yyyyyyy4----',
    '--4yyyyyyy4-----',
    '-4y44yy4yy4-----',
    '-4---4y4--4-----',
    '------4----4----',
    '----------------',
    '----------------',
  ]
};

export const THEME_PALETTES: Record<string, Partial<Record<string, string>>> = {
  overworld: {},
  underground: {
    'G': '#008888', // Green -> Cyan
    'g': '#00cccc',
    '2': '#008888', // light brick -> cyan
    '1': '#004444', // dark brick shadow -> dark cyan
    'C': '#008888',
    'c': '#004444',
  },
  snow: {
    'G': '#ffffff', // Green -> White
    'g': '#dddddd',
    '2': '#ffffff',
    '1': '#cccccc',
    'C': '#ffffff',
    'c': '#aaaaaa',
  }
};

const cache = new Map<string, HTMLCanvasElement>();

export function getSpriteCanvas(spriteName: string, flipX = false, theme = 'overworld'): HTMLCanvasElement {
  const key = `${spriteName}_${flipX}_${theme}`;
  if (cache.has(key)) return cache.get(key)!;

  const data = SPRITES[spriteName];
  if (!data) throw new Error(`Sprite not found: ${spriteName}`);

  const canvas = document.createElement('canvas');
  const width = data[0].length;
  const height = data.length;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);

  const themeColors = THEME_PALETTES[theme] || {};

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = data[y][flipX ? width - 1 - x : x];
      if (char !== '-') {
        ctx.fillStyle = themeColors[char] || PALETTE[char] || char;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  cache.set(key, canvas);
  return canvas;
}
