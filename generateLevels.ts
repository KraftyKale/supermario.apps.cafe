import * as fs from 'fs';

const NUM_LEVELS = 25;
const LEVELSStr: string[] = [];

for (let i = 0; i < NUM_LEVELS; i++) {
  // length = 40 + i * 15
  const length = 40 + i * 15; 
  const map: string[][] = [];
  for(let j=0; j<14; j++) map.push(new Array(length).fill('.'));
  
  // Floor
  for(let x=0; x<length; x++) {
    map[12][x] = 'G';
    map[13][x] = 'G';
  }

  let x = 5;
  while (x < length - 10) {
     const width = 3 + Math.floor(Math.random() * 4);
     
     // 0: Pit, 1: Wall jump, 2: Lucky blocks, 3: Spikes, 4: Flat + Enemies
     const feature = Math.floor(Math.random() * 5);
     
     if (feature === 0) {
       for(let w=0; w<width; w++) {
         map[12][x+w] = '.';
         map[13][x+w] = '.';
       }
       if (x + 2 < length - 1) {
         map[9][x + 2] = 's';
       }
       x += width;
     } else if (feature === 1) {
       for(let y=4; y<=11; y++) map[y][x] = 's';
       x += 4;
       if (x < length - 1) {
          for(let y=4; y<=11; y++) map[y][x] = 's';
       }
       x += 3;
     } else if (feature === 2) {
       if (x+3 < length-1) {
         map[8][x+1] = '?';
         map[8][x+3] = '?';
         map[11][x+2] = 'e';
       }
       x += 5;
     } else if (feature === 3) {
       for(let w=0; w<width; w++) {
         if (x+w < length) map[11][x+w] = '^';
       }
       if (x < length) map[11][x] = 'p'; 
       x += width + 1;
     } else {
        if (x+3 < length-1) {
          map[11][x+2] = 'e';
          map[11][x+3] = 't'; 
          map[2][x+2] = 'c';
        }
        x += 5;
     }
  }

  // End pipe
  let endX = length - 6;
  if (endX < 0) endX = 0;
  for(let ex=endX-2; ex<length; ex++) {
     map[12][ex] = 'G';
     map[13][ex] = 'G';
     for(let ey=0; ey<12; ey++) map[ey][ex] = '.';
  }
  map[10][endX] = '>';
  map[11][endX] = '|';

  const stringified = map.map((row: string[]) => "    '" + row.join('') + "',").join('\n');
  LEVELSStr.push(`  [ // Level ${i + 1}\n${stringified}\n  ],`);
}

const levelCode = fs.readFileSync('src/level.ts', 'utf8');

const topParts = levelCode.split('export const LEVELS = [')[0];
const bottomParts = levelCode.split('];\n\nexport type BlockType')[1];

const finalStr = `${topParts}export const LEVELS = [\n${LEVELSStr.join('\n')}\n];\n\nexport type BlockType${bottomParts}`;

fs.writeFileSync('src/level.ts', finalStr);
console.log('Procedural levels generated');
