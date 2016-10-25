import { sumArr } from '../util/util_func';

export default class Entity {
  constructor(options){
    const { name, lvl, hp, att, def, pos, spd, exp, stage } = options;
    this.name = name;
    this.lvl = lvl;
    this.maxHp = hp;
    this.hp = hp;
    this.att = att;
    this.def = def;
    this.pos = pos;
    this.exp = exp;
    this.stage = stage;
    this.spd = spd || 1;
    this.animation = "stand";
    this.changeAnim = false;
  }

  takeDmg(attk, vec){
    let dmg = attk - this.def;
    if(dmg < 1){
      dmg = 1;
    }

    if(!this.enemy && dmg < Math.floor(this.lvl/3)){
      dmg = Math.floor(this.lvl/3);
    }

    this.hp = Math.floor(this.hp - dmg);
    const rate = (10* Math.log(this.spd + 3) - 5) / 5;
    let scale = (60 + 20 * (attk - this.def)) / rate;
    if(scale < 0){ scale = 0; }
    if(scale > 60){ scale = 60;}
    this.move([scale * vec[0], scale * vec[1]], true);
    if(Math.floor(this.hp) <= 0){
      return this.body;
    }
  }

  draw(stg){
    const { pos, body, animation } = this;
    body.zIndex = 500;
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

    let rate = (10* Math.log(spd + 3) - 5)/ 15;
    dir = [dir[0] * rate, dir[1] * rate];
    const newPos = this.checkBounds(sumArr(this.pos, dir));
    this.pos = newPos;
    body.x = newPos[0];
    body.y = newPos[1];
  }

  checkBounds(pos){
    const bounds = this.body.getBounds();
    let xMax = 475 - bounds.width;
    const yMax = 475 - bounds.height;
    const min = (this.enemy && this.body.scaleX === -1) ? 20 + bounds.width : 20;
    if(this.enemy && this.body.scaleX === -1){
      xMax = 500;
    }else if(!this.enemy){
      xMax = 450;
    }
    if(pos[0] > xMax){
      pos[0] = xMax;
    }else if(pos[0] < min){
      pos[0] = min;
    }
    if(pos[1] > yMax){
      pos[1] = yMax;
    }else if(pos[1] < 20){
      pos[1] = 20;
    }
    return pos;
  }
}
