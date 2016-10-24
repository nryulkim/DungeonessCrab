export const VERSION = "1.0.0";

export const STATS = [
    "maxHp",
    "att",
    "def",
    "spd"
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
