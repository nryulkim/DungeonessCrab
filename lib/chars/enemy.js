import Entity from './entity_obj';
import { sample, sumArr } from '../util/util_func';

export default class Enemy extends Entity{
  constructor(options){
    super(options);
    this.moveTypes = [
      [0,0],
      [0,1],
      [1,0],
      [1,1],
      [0,-1],
      [-1,0],
      [-1,-1]
    ];
    this.steps = 0;
    this.dir = [];
    this.enemy = true;
    this.body = options.crab;
    this.hitBox = {
      x: this.pos[0] + 16,
      y: this.pos[1] + 16,
      r: 14
    };

    this.removeBody = this.removeBody.bind(this);
  }

  move(dir, attacked){
    const { body } = this;
    if(attacked){
      this.steps = 0;
    }else if(this.steps > 0){
      this.steps -= 1;
      dir = this.dir;
    }else{
      this.dir = dir;
      this.steps = 30;
      if(dir[0] === 1){
        body.gotoAndPlay("moveR");
        if(body.scaleX === -1){
          this.pos[0] -= 33;
          body.scaleX = 1;
        }
      }else if(dir[0] === 0){
        body.gotoAndPlay("stand");
      }else if(dir[0] === -1){
        body.gotoAndPlay("moveR");
        if(body.scaleX === 1){
          this.pos[0] += 33;
          body.scaleX = -1;
        }
      }
    }
    super.move(dir);
    let x = this.pos[0] + 16;
    if(body.scaleX === -1){
      x -= 33;
    }
    this.hitBox.x = x;
    this.hitBox.y = this.pos[1] + 16;
  }

  takeDmg(attk, vec){
    const dead = super.takeDmg(attk, vec);
    if(dead){
      this.body.addEventListener("animationend", this.removeBody);
      this.body.gotoAndPlay("die");
      return dead;
    }
  }

  removeBody(){
    const { body, stage } = this;
    body.removeEventListener("animationend", this.removeBody);
    stage.removeChild(body);
  }

  step(){
    this.move(sample(this.moveTypes));
  }

}
