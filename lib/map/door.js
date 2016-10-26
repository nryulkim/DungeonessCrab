export default class Door{
  constructor(pos){
    this.hitbox = {
      x: pos[0],
      y: pos[1],
      w: 25,
      h: 10
    };
  }
}
