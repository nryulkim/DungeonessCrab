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
      this.steps = 10;
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
  }

  step(){
    this.move(sample(this.moveTypes));
  }

}
