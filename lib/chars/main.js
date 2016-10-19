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

  bindKeys(){
    const { keys } = this;
    document.addEventListener("keydown", (e) => {
      if(Object.keys(keys).includes(e.keyCode.toString())){
        keys[e.keyCode] = true;
      }else{
        this.levelUp();
      }
    });
    document.addEventListener("keyup", (e) => {
      if(Object.keys(keys).includes(e.keyCode.toString())){
        keys[e.keyCode] = false;
      }
    });
  }
}
