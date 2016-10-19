import { sumArr } from '../util/util_func';

export default class Entity {
  constructor(options){
    const { name, lvl, hp, att, def, pos, color, spd } = options;
    this.name = name;
    this.lvl = lvl;
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
    body.x = pos[0] * spd;
    body.y = pos[1] * spd;
    body.name = name;

    stg.addChild(body);
    stg.update();
  }

  move(dir){
    const max = (475/this.spd);

    let newPos = sumArr(this.pos, dir);
    if(newPos[0] > max){
      newPos[0] = max;
    }else if(newPos[0] < 0){
      newPos[0] = 0;
    }

    if(newPos[1] > max){
      newPos[1] = max;
    }else if(newPos[1] < 0){
      newPos[1] = 0;
    }

    this.pos = newPos;
  }
}
