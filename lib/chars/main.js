import Entity from './entity_obj';
import UserDisplay from '../user_display';
import { getSkew, objEach } from '../util/util_func';

export default class Character extends Entity{
  constructor(options){
    super(options);
    this.stage = options.stage;
    this.swing = options.swing;
    this.body = options.body;
    this.spd = 3;

    this.setKeys();
    this.attacking = false;
    this.attacked = false;
    this.display = new UserDisplay(this);
    this.removeSwing = this.removeSwing.bind(this);
    this.useKey = this.useKey.bind(this);
    this.stopKey = this.stopKey.bind(this);
    this.attack = this.attack.bind(this);
    this.bindKeys();
  }

  setKeys(){
    this.keys = {
      87: false,
      65: false,
      83: false,
      68: false
    };
  }


  step(){
    const char = this;
    const { keys, attacking } = char;
    if(!attacking){
      objEach(keys, (key) => {
        if(key){
          if(key === 87){
            char.checkAnimation("moveU");
            char.move([0,-1]);
          }else if(key === 65){
            char.checkAnimation("moveL");
            char.move([-1, 0]);
          }else if(key === 83){
            char.checkAnimation("moveD");
            char.move([0, 1]);
          }else if(key === 68){
            char.checkAnimation("moveR");
            char.move([1, 0]);
          }
        }
      });
    }
  }

  checkAnimation(anim){
    const currAnim = this.body.currentAnimation;
    if(currAnim !== anim && currAnim !== "moveU" && currAnim !== "moveD"){
      this.animation = anim;
      this.changeAnim = true;
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

  attack(e){
    const { swing, stage, pos } = this;
    if(!this.attacking){
      const skew = getSkew(e.offsetX, e.offsetY, pos[0], pos[1]);
      this.attacking = true;
      stage.addChild(swing);
      this.adjustSwing(swing, skew, pos);
      this.skew += 20;
      swing.addEventListener("animationend", this.removeSwing);
      swing.gotoAndPlay("attack");
    }
  }


  adjustSwing(swing, skew, pos){
    const rads = skew * Math.PI / 180;
    const xAdj = (60*Math.cos(rads));
    const yAdj = (60*Math.sin(rads));
    swing.x = pos[0] + 15 - xAdj + yAdj/2;
    swing.y = pos[1] + 13 - yAdj - xAdj/2;
    swing.width = 25;
    swing.height = 25;
    swing.skewX = skew;
    swing.skewY = skew;
  }

  removeSwing(){
    const { swing, stage } = this;
    this.attacking = false;
    this.attacked = false;
    swing.removeEventListener("animationend", this.removeSwing);
    stage.removeChild(swing);
  }

  bindKeys(){
    document.addEventListener("keydown", this.useKey);
    document.addEventListener("keyup", this.stopKey);
    $("#board").on("click", this.attack);
  }

  useKey(e){
    const keys = this.keys;
    if(Object.keys(keys).includes(e.keyCode.toString())){
      keys[e.keyCode] = e.keyCode;
    }
  }

  stopKey(e){
    const keys = this.keys;
    if(Object.keys(keys).includes(e.keyCode.toString())){
      keys[e.keyCode] = false;
    }
  }
}
