import Entity from './entity_obj';
import UserDisplay from '../user_display';

export default class Character extends Entity{
  constructor(options){
    super(options);
    this.keys = {
      87: false,
      65: false,
      83: false,
      68: false
    };
    this.bindKeys();
    this.display = new UserDisplay(this);

    this.handleComplete = this.handleComplete.bind(this);

    this.setSprites();
  }

  setSprites(){
    const manifest = [
      {src: "sword_swing.png", id: "swing"}
    ];
    this.loader = new createjs.LoadQueue(false);
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

  step(){
    const { keys } = this;
    const keyTypes = Object.keys(keys);
    for (let i = 0; i < keyTypes.length; i++) {
      const key = keyTypes[i];
      if(keys[key]){
        if(key === "87"){
          this.move([0,-1]);
        }else if(key === "65"){
          this.move([-1, 0]);
        }else if(key === "83"){
          this.move([0, 1]);
        }else if(key === "68"){
          this.move([1, 0]);
        }
      }
    }
  }

  levelUp(){
    this.lvl += 1;
    this.maxHp += 10;
    this.hp = this.maxHp;
    this.att += 1;
    this.def += 1;
    this.spd += 1;
    this.display.update(this);
  }

  attack(stg){
    stg.addChild(this.swing);
    this.swing.x = this.pos[0] - 25;
    this.swing.y = this.pos[1] - 25;
    this.swing.addEventListener("animationend", this.removeSwing(stg));
    this.swing.gotoAndPlay("attack");
  }

  removeSwing(stg){
    const { swing } = this;
    return () => {
      swing.removeEventListener("animationend", this.removeSwing(stg));
      stg.removeChild(swing);
    };
  }

  bindKeys(){
    const char = this;
    const { keys } = this;
    document.addEventListener("keydown", (e) => {
      if(Object.keys(keys).includes(e.keyCode.toString())){
        keys[e.keyCode] = true;
      }
    });
    document.addEventListener("keyup", (e) => {
      if(Object.keys(keys).includes(e.keyCode.toString())){
        keys[e.keyCode] = false;
      }
    });
  }
}
