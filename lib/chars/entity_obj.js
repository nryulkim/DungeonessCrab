import { sumArr } from '../util/util_func';

export default class Entity {
  constructor(options){
    const { name, lvl, hp, att, def, pos, color, spd } = options;
    this.name = name;
    this.lvl = lvl;
    this.maxHp = hp;
    this.hp = hp;
    this.att = att;
    this.def = def;
    this.pos = pos;
    this.spd = spd || 5;
    this.color = color;
    this.body = new createjs.Shape();
  }

  draw(stg){
    const { body, color, pos, name, spd } = this;
    body.graphics.beginFill(color);
    body.graphics.drawRect(0, 0, 25, 25);
    body.graphics.endFill();
    body.x = pos[0];
    body.y = pos[1];
    body.width = 25;
    body.height = 25;
    body.name = name;
    stg.addChild(body);
  }

  move(dir){
    const { body, spd } = this;
    dir = [dir[0]*spd, dir[1]*spd];
    const newPos = this.checkBounds(sumArr(this.pos, dir));
    this.pos = newPos;

    body.x = newPos[0];
    body.y = newPos[1];
  }

  checkBounds(pos){
    if(pos[0] > 475){
      pos[0] = 475;
    }else if(pos[0] < 0){
      pos[0] = 0;
    }
    if(pos[1] > 475){
      pos[1] = 475;
    }else if(pos[1] < 0){
      pos[1] = 0;
    }
    return pos;
  }
}
