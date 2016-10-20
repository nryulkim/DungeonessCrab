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


  setSprites(){
    const manifest = [
      {src: "sword_swing.png", id: "swing"}
    ];
    this.loader = new createjs.LoadQueue(false);
    this.loader._crossOrigin = "Anonymous";
  	this.loader.addEventListener("complete", this.handleComplete);
  	this.loader.loadManifest(manifest, true, "./assets/art/");
  }


  handleComplete(){
    const { loader } = this;
    this.sprite = new createjs.SpriteSheet({
      images: [loader.getResult("swing")],
      frames: {
        width: 50, height: 50,
        regX: 0, regY: 0
      },
      animations: {
        attack: [0, 12, "attack"]
      }
    });
    this.swing = new createjs.Sprite(this.sprite);
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
