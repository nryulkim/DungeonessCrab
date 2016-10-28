import Entity from './entity_obj';
import Item from './inventory/item';
import { sample, sumArr, normalize, distance } from '../util/util_func';
import * as Constants from "../util/constants";


export default class Enemy extends Entity{
  constructor(options){
    super(options);
    this.body = options.crab;
    this.newBag = options.newBag;
    this.addItem = options.addItem;
    this.removeItem = options.removeItem;
    this.addToken = options.addToken;
    this.steps = 0;
    this.dir = [];
    this.enemy = true;
    this.hitBox = {
      x: this.pos[0] + 16,
      y: this.pos[1] + 16,
      r: 14
    };

    this.removeBody = this.removeBody.bind(this);
  }

  move(dir, attacked, chase){
    const { body } = this;

    if(attacked){
      this.steps = 0;
    }else if(this.steps > 0){
      this.steps -= 1;
      dir = chase ? dir : this.dir;
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
      window.setTimeout(this.removeBody, 700);
      this.body.gotoAndPlay("die");
      this.addToken();
      return dead;
    }
  }

  removeBody(){
    const { body, stage, lvl } = this;
    if(Math.random() < 1){
      this.dropItem();
    }
    stage.removeChild(body);
  }

  step(pos){
    const dis = distance(this.pos, pos);
    if(dis < 100 + (5*this.lvl)){
      const vec = normalize(this.pos, pos);
      let x = -vec[0] / Math.abs(vec[0]);
      let y = -vec[1] / Math.abs(vec[1]);
      if(x !== x){ x = 0; }
      if(y !== y){ y = 0; }

      const dir = [ x, y ];

      this.move(dir, false, true);
    }
    this.move(sample(Constants.MOVE_DIRS), false, false);
  }


  dropItem(){
    const stats = {};
    stats.stat = sample(Constants.STATS);
    let x = this.pos[0] - 33;
    stats.val = this.lvl + Constants.statVar();
    if(stats.val < 1){ stats.val = 1; }
    if(this.body.scaleX !== -1){
      x = this.pos[0];
    }
    const y = this.pos[1];
    if (Math.random() < 0.2){
      stats.stat = "pot";
    }else if (Math.random() < 0.2){
      stats.stat = "PBomb";
    }
    const item = new Item(stats, x, y, this.newBag(), this.removeItem);


    item.draw(this.stage);
    this.addItem(item);
  }
}
