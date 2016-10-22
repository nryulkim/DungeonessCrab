
export default class Item{
  constructor(stats, body){
    const { hp, att, def, spd, x, y } = stats;
    this.hp = hp;
    this.att = att;
    this.def = def;
    this.spd = spd;
    this.body = body;
    this.body.x = x;
    this.body.y = y;
    this.hitBox = {
      x: x + 12,
      y: y + 15,
      r: 10
    };
  }

  draw(stage){
    stage.addChild(this.body);
  }

  pickUp(stage, inventory){
    stage.removeChild(this.body);
    inventory.getItem(this);
  }
}
