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
  }

  move(dir){
    if(this.steps > 0){
      this.steps -= 1;
      dir = this.dir;
    }else{
      this.dir = dir;
      this.steps = 10;
    }
    super.move(dir);
  }

  step(){
    this.move(sample(this.moveTypes));
  }

}
