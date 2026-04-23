const fs = require('fs');

const NUM_LEVELS = 25;
const LEVELSStr = [];

for (let i = 0; i < NUM_LEVELS; i++) {
  // length = 60 + i * 15
  const length = 60 + i * 15; 
  const map = [];
  for(let j=0; j<14; j++) map.push(new Array(length).fill('.'));
  
  // Basic Sky/Cloud Decor
  for(let cx=5; cx<length-10; cx+=10) {
    if (Math.random() > 0.5) {
       map[3 + Math.floor(Math.random()*2)][cx] = 'c';
    }
  }

  // Floor
  for(let x=0; x<length; x++) {
    map[12][x] = 'G';
    map[13][x] = 'G';
  }

  let x = 5;
  while (x < length - 15) {
     // 0: Small Pit, 1: Pipe Obstacle, 2: Brick structure (SMB style), 3: Staircase, 4: Enemy cluster
     // With scaling probabilities
     const feature = Math.floor(Math.random() * 5);
     
     if (feature === 0) {
       // Small Pit (Normal jumping)
       const pitSize = 2 + Math.floor(Math.random() * 2);
       for(let w=0; w<pitSize; w++) {
         map[12][x+w] = '.';
         map[13][x+w] = '.';
       }
       // Add a bridging block or a hovering coin
       if (pitSize === 3 && Math.random() > 0.5) {
         map[8][x + 1] = 's';
       } else {
         map[9][x + 1] = 'o';
       }
       x += pitSize + 1;
       
     } else if (feature === 1) {
       // Pipe Obstacle + Enemy
       const pipeHeight = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3 tall
       for (let py = 11; py > 11 - pipeHeight; py--) {
          map[py][x] = '|';
          map[py][x+1] = '|';
       }
       map[11 - pipeHeight][x] = '>';
       map[11 - pipeHeight][x+1] = '>';
       
       if (Math.random() > 0.5) {
         map[11][x+3] = 'e'; // goomba after pipe
       }
       x += 4;
       
     } else if (feature === 2) {
       // Classic Brick Structure
       const style = Math.floor(Math.random() * 3);
       if (style === 0) {
         // ? b ? b ?
         map[8][x] = '?';
         map[8][x+1] = 'b';
         map[8][x+2] = '?';
         map[8][x+3] = 'b';
         map[8][x+4] = '?';
         x += 6;
       } else if (style === 1) {
         // High bricks
         map[5][x+1] = 'b';
         map[5][x+2] = '?';
         map[5][x+3] = 'b';
         // Low brick
         map[8][x+2] = 'b';
         map[11][x+2] = 'e'; // enemy under
         x += 5;
       } else {
         // Wall jump mixed in
         for(let y=6; y<=11; y++) map[y][x] = 's';
         x += 4;
         if (x < length - 10) {
           for(let y=6; y<=11; y++) map[y][x] = 's';
         }
         map[8][x-2] = '?';
         x += 3;
       }
     } else if (feature === 3) {
       // Classic Staircase
       for (let s=0; s<4; s++) {
         for (let sy=0; sy<=s; sy++) {
           map[11-sy][x+s] = 's';
         }
       }
       x += 4;
       // Occasional gap after stairs
       if (Math.random() > 0.5) {
         map[12][x] = '.'; map[13][x] = '.';
         map[12][x+1] = '.'; map[13][x+1] = '.';
         x += 2;
         for (let s=3; s>=0; s--) {
           for (let sy=0; sy<=s; sy++) {
             map[11-sy][x+(3-s)] = 's';
           }
         }
         x += 4;
       }
     } else {
        // Flat with Goombas
        for (let num=0; num < 2 + Math.random()*2; num++) {
           map[11][x + num*2] = 'e';
        }
        x += 6;
     }
  }

  // Final level ending pipe
  let endX = length - 6;
  if (endX < 0) endX = 0;
  for(let ex=endX-4; ex<length; ex++) {
     map[12][ex] = 'G';
     map[13][ex] = 'G';
     for(let ey=0; ey<12; ey++) map[ey][ex] = '.';
  }
  
  // Staircase to pipe (classic aesthetic)
  map[11][endX-4] = 's';
  map[11][endX-3] = 's'; map[10][endX-3] = 's';
  map[11][endX-2] = 's'; map[10][endX-2] = 's'; map[9][endX-2] = 's';

  map[10][endX] = '>'; map[10][endX+1] = '>';
  map[11][endX] = '|'; map[11][endX+1] = '|';

  const stringified = map.map((row) => "    '" + row.join('') + "',").join('\n');
  LEVELSStr.push(`  [ // Level ${i + 1}\n${stringified}\n  ],`);
}

const levelCode = fs.readFileSync('src/level.ts', 'utf8');

const topParts = levelCode.split('export const LEVELS = [')[0];
const bottomParts = levelCode.split('];\n\nexport type BlockType')[1];

const finalStr = `${topParts}export const LEVELS = [\n${LEVELSStr.join('\n')}\n];\n\nexport type BlockType${bottomParts}`;

fs.writeFileSync('src/level.ts', finalStr);
console.log('Procedural classic levels generated with JS');
