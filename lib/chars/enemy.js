import Entity from './entity_obj';
import Item from './inventory/item';
import { sample, sumArr, normalize, distance } from '../util/util_func';

export default class Enemy extends Entity{
  constructor(options){
    super(options);
    this.stats = ['maxHp', 'att', 'def', 'spd'];
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
    this.newBag = options.newBag;
    this.hitBox = {
      x: this.pos[0] + 16,
      y: this.pos[1] + 16,
      r: 14
    };
    this.addItem = options.addItem;

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
      this.body.addEventListener("animationend", this.removeBody);
      this.body.gotoAndPlay("die");
      return dead;
    }
  }

  removeBody(){
    const { body, stage } = this;
    body.removeEventListener("animationend", this.removeBody);
    if(Math.random() < 0.4 + (0.25 * Math.log(this.lvl))){
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
    this.move(sample(this.moveTypes), false, false);
  }


  dropItem(){
    const stats = {};
    stats.stat = sample(this.stats);
    let x = this.pos[0] - 33;
    stats.val = this.lvl + ((1/3 * Math.log(Math.random())) + 0.2);
    if(stats.val < 1){ stats.val = 1; }
    if(this.body.scaleX !== -1){
      x = this.pos[0];
    }
    const y = this.pos[1];
    if (Math.random() < 0.4){
      stats.stat = "pot";
    }else if (Math.random() < 0.2){
      stats.stat = "PBomb";
    }
    const item = new Item(stats, x, y, this.newBag());


    item.draw(this.stage);
    this.addItem(item);
  }
}
