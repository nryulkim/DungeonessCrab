
export default class Item{
  constructor(stats, x, y, body, removeItem){
    this.id = null;
    this.pos = null;
    this.equipped = false;
    this.stat = stats.stat;
    this.val = stats.val;
    this.removeItem = removeItem;
    if(body){
      this.body = body;
      this.body.x = x;
      this.body.y = y;
      this.hitBox = {
        x: x + 12,
        y: y + 15,
        r: 10
      };
    }
  }

  draw(stage){
    stage.addChild(this.body);
    window.setTimeout(this.timeOut(stage), 5000);
  }

  timeOut(stage){
    const item = this;
    return () => {
      item.removeItem(item);
      stage.removeChild(item.body);
    };
  }

  pickUp(stage, inventory){
    stage.removeChild(this.body);
    inventory.addItem(this);
  }
}
