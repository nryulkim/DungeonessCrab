
export default class Item{
  constructor(stats, x, y, body){
    this.id = null;
    this.pos = null;
    this.equipped = false;
    this.stat = Object.keys(stats)[0];
    this[this.stat] = stats[this.stat];
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

  pickUp(stage, player){
    stage.removeChild(this.body);
    player.inventory.addItem(this);
  }
}
