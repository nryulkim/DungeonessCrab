import Enemy from '../chars/enemy';
import { distance, sample } from '../util/util_func';
import uuid from 'node-uuid';

export default class Room{
  constructor(options){
    this.id = uuid.v4();
    this.neighbors = options.neighbors;
    this.enemies = {};
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
      const idx = Math.floor(Math.random() * this.walls.length);
      const oldWall = this.walls[idx];
      const x = oldWall.x;
      const y = oldWall.y;
      const scale = oldWall.scaleX;
      this.doors[i] = {
        x: x-5,
        y: y-5,
        w: 35,
        h: 35,
        id: this.neighbors[i].id
      };
      const door = new createjs.Bitmap(this.assets.generateDoor());
      door.x = x;
      door.y = y;
      door.scaleX = scale;
      door.scaleY = scale;
      this.walls[idx] = door;
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
    if(Object.keys(this.enemies).length === 0){
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
    for (let i = 0; i < lvl; i++) {
      const crabPos = this.getPos(pos);
      const enemy = new Enemy({
        name: "Crab" + i,
        stage: this.crabFuncs.stage,
        hp: lvl*1.5,
        lvl: lvl,
        att: lvl*2 - 1,
        def: lvl*2 - 1,
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
