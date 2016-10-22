
export default class Inventory{
  constructor(inventory){
    this.inventory = inventory || [];
  }

  addItem(item){
    if(this.inventory.length < 6){
      inventory.push(item);
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
}
