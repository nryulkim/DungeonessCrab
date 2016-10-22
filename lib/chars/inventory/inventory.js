
export default class Inventory{
  constructor(inventory){
    this.inventory = inventory || [];
  }

  addItem(item){
    if(this.inventory.length < 6){
      this.inventory.push(item);
      this.render();
    }
  }

  removeItem(i){
    this.inventory[i] = null;
  }

  getItem(i){
    if(this.inventory[i]){
      return this.inventory[i];
    }
  }

  render(){
    for (let i = 0; i < this.inventory.length; i++) {
      const $item = $("#item" + i);
      switch(this.inventory[i].stat){
        case "att":
          $item.addClass("weapon");
          break;
        case "spd":
          $item.addClass("boots");
          break;
        case "hp":
        case "def":
          $item.addClass("armor");
          break;
      }
    }
  }
}
