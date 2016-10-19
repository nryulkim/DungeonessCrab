import Entity from './entity_obj';

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

  bindKeys(){
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
