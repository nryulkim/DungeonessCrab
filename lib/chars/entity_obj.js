import { sumArr } from '../util/util_func';

export default class Entity {
  constructor(options){
    const { name, lvl, hp, att, def, pos, spd } = options;
    this.name = name;
    this.lvl = lvl;
    this.maxHp = hp;
    this.hp = hp;
    this.att = att;
    this.def = def;
    this.pos = pos;
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
    dir = [dir[0]*spd, dir[1]*spd];
    const newPos = this.checkBounds(sumArr(this.pos, dir));
    this.pos = newPos;
    body.x = newPos[0];
    body.y = newPos[1];
  }

  takeDmg(attk){
    this.hp -= attk;
    if(this.hp <= 0){
      return this.body;
    }
  }

  checkBounds(pos){
    if(pos[0] > 466){
      pos[0] = 466;
    }else if(pos[0] < 33 && this.body.scaleX === -1){
      pos[0] = 33;
    }
    if(pos[1] > 466){
      pos[1] = 466;
    }else if(pos[1] < 0){
      pos[1] = 0;
    }
    return pos;
  }
}
