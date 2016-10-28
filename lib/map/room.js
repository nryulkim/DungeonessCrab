import Enemy from '../chars/enemy';
import { distance, sample, subArr } from '../util/util_func';
import uuid from 'node-uuid';
import { LEFT_DOOR_POS,
         TOP_DOOR_POS,
         RIGHT_DOOR_POS,
         BOT_DOOR_POS } from '../util/constants';

export default class Room{
  constructor(options){
    this.id = uuid.v4();
    this.neighbors = options.neighbors;
    this.pos = options.pos;
    this.lvl = options.lvl;
    this.crabFuncs = options.crabFuncs;
    this.assets = options.assets;
    this.floors = [];
    this.walls = [];
    this.doors = [];
    this.steps = null;
    this.drawRoom();
  }

  setDoors(){
    for (var i = 0; i < this.neighbors.length; i++) {
      const dir = subArr(this.neighbors[i].pos, this.pos);
      let props = {};
      if (dir[0] === 1 && dir[1] === 0){
        props = RIGHT_DOOR_POS;
      }else if(dir[0] === 0 && dir[1] === 1){
        props = BOT_DOOR_POS;
      }else if(dir[0] === -1 && dir[1] === 0){
        props = LEFT_DOOR_POS;
      }else if(dir[0] === 0 && dir[1] === -1){
        props = TOP_DOOR_POS;
      }

      this.doors[i] = {
        x: props.x - 5,
        y: props.y - 5,
        w: 35,
        h: 35,
        playerPos: props.playerPos,
        id: this.neighbors[i].id
      };

      const door = new createjs.Bitmap(this.assets.generateDoor());
      door.x = props.x;
      door.y = props.y;
      door.scaleX = props.scale;
      door.scaleY = props.scale;
      this.walls[props.idx] = door;
    }
  }

  setSteps(){
    const idx = Math.floor(Math.random() * this.floors.length);
    const oldFloor = this.floors[idx];
    const x = oldFloor.x;
    const y = oldFloor.y;
    const scale = oldFloor.scaleX;
    this.stepBox = {
      x: x,
      y: y,
      w: 25,
      h: 25
    };
    const steps = new createjs.Bitmap(this.assets.generateSteps());
    steps.x = x;
    steps.y = y;
    steps.scaleX = scale;
    steps.scaleY = scale;
    this.floors[idx] = steps;
  }

  setEnemies(pos){
    if(!this.enemies){
      this.enemies = {};
      this.createEnemies(pos);
    }

    const enemyNames = Object.keys(this.enemies);
    for (let i = 0; i < enemyNames.length; i++) {
      this.enemies[enemyNames[i]].draw(this.crabFuncs.stage);
    }
  }

  removeEnemy(name){
    delete this.enemies[name];
  }

  createEnemies(pos){
    const { lvl } = this;

    const rate = 9/20 * Math.pow(lvl, (lvl/10 + 1));
    for (let i = 0; i < Math.ceil(lvl/1.5); i++) {
      const crabPos = this.getPos(pos);
      const enemy = new Enemy({
        name: "Crab" + i,
        stage: this.crabFuncs.stage,
        hp: lvl * 2,
        lvl: lvl,
        att: lvl * rate/2 - 1,
        def: lvl * rate/2 - 1,
        exp: lvl/2,
        spd: lvl/8,
        pos: crabPos,
        crab: this.assets.generateCrab(),
        newBag: this.assets.newBag,
        addItem: this.crabFuncs.addItem,
        removeItem: this.crabFuncs.removeItem,
        addToken: this.crabFuncs.addToken
      });
      this.enemies[enemy.name] = enemy;
    }
  }

  getPos(pos){
    let r1 = Math.floor(Math.random() * 390) + 60,
        r2 = Math.floor(Math.random() * 390) + 60;
    while(distance(pos, [r1,r2]) < 60){
      r1 = Math.floor(Math.random() * 390) + 60;
      r2 = Math.floor(Math.random() * 390) + 60;
    }
    return [r1,r2];
  }

  drawRoom(){
    for (let i = 0; i < 20; i++) {
      for(let j = 0; j < 20; j++){
        let obj;
        let prop;
        if(j === 0 || j === 19 || i === 0 || i === 19){
          obj = new createjs.Bitmap(this.assets.generateRandomWall());
          prop = "walls";
        }else{
          obj = new createjs.Bitmap(this.assets.generateRandomFloor());
          prop = "floors";
        }
        obj.scaleX = 0.52;
        obj.scaleY = 0.52;
        obj.x = 25*i;
        obj.y = 25*j;
        this[prop].push(obj);
      }
    }
  }
}
