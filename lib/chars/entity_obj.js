import { sumArr } from '../util/util_func';

export default class Entity {
  constructor(options){
    const { name, lvl, hp, att, def, pos, spd, exp } = options;
    this.name = name;
    this.lvl = lvl;
    this.maxHp = hp;
    this.hp = hp;
    this.att = att;
    this.def = def;
    this.pos = pos;
    this.exp = exp;
    this.spd = spd || 1;
    this.animation = "stand";
    this.changeAnim = false;
  }

  draw(stg){
    const { pos, body, animation } = this;
    stg.addChild(body);
    body.x = pos[0];
    body.y = pos[1];
    body.gotoAndPlay(animation);
  }

  move(dir){
    const { body, spd, changeAnim, animation } = this;
    if(changeAnim){
      body.gotoAndPlay(animation);
      this.changeAnim = false;
    }
    dir = [dir[0] * (spd/2), dir[1] * (spd/2)];
    const newPos = this.checkBounds(sumArr(this.pos, dir));
    this.pos = newPos;
    body.x = newPos[0];
    body.y = newPos[1];
  }

  takeDmg(attk, vec){
    let dmg = attk - this.def;
    if(dmg < 1){
      dmg = 1;
    }
    this.hp -= dmg;
    const scale = 20 * attk / this.spd;
    this.move([scale * vec[0], scale * vec[1]], true);
    if(this.hp <= 0){
      return this.body;
    }
  }

  checkBounds(pos){
    const bounds = this.body.getBounds();
    let xMax = 500 - bounds.width;
    const yMax = 500 - bounds.height;
    const min = this.enemy ? bounds.width : 0;
    if(this.enemy && this.body.scaleX === -1){
      xMax = 500;
    }
    if(pos[0] > xMax){
      pos[0] = xMax;
    }else if(pos[0] < min){
      pos[0] = min;
    }
    if(pos[1] > yMax){
      pos[1] = yMax;
    }else if(pos[1] < 0){
      pos[1] = 0;
    }
    return pos;
  }
}
