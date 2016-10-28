export const VERSION = "1.0.0";
export const STATS = [
    "maxHp",
    "att",
    "def",
    "spd"
  ];

export const db = firebase.database();

export const NEIGHBOR_DIRS = [
  [0,1],
  [0,-1],
  [1,0],
  [-1,0]
];

export const MOVE_DIRS = [
    [0,0],
    [0,1],
    [1,0],
    [1,1],
    [0,-1],
    [-1,0],
    [-1,-1]
  ];

export const LEFT_DOOR_POS = {
  x: 0,
  y: 250,
  scale: 0.52,
  idx: 10,
  w: 35,
  h: 35,
  playerPos: [460, 250]
};
export const TOP_DOOR_POS = {
  x: 250,
  y: 0,
  scale: 0.52,
  idx: 38,
  w: 35,
  h: 35,
  playerPos: [250, 460]
};
export const RIGHT_DOOR_POS = {
  x: 475,
  y: 250,
  scale: 0.52,
  idx: 66,
  w: 35,
  h: 35,
  playerPos: [40, 250]
};
export const BOT_DOOR_POS = {
  x: 250,
  y: 475,
  scale: 0.52,
  idx: 39,
  w: 35,
  h: 35,
  playerPos: [250, 40]
};

export const dropRate = (lvl) => { return 0.3 * Math.log(lvl); };

export const statVar = () => {
  return ((1/3 * Math.log(Math.random())) + 0.2);
};

export const DEFAULT_PRESTIGE = {
  tokens: 0,
  buffs: {
    maxHp: 1,
    att: 1,
    def: 1,
    spd: 1
  },
  version: VERSION
};
