
export default class Inventory{
  constructor(inventory){
    this.inventory = inventory || [];
    this.num = this.inventory.length;
    this.removeItem = this.removeItem.bind(this);
    this.render();
  }

  addItem(item){
    if(this.inventory.length < 6){
      item.id = this.num;
      this.num ++;
      this.inventory.push(item);
      this.render();
    }
  }

  removeItem(i){
    this.inventory.splice(i, 1);
    this.render();
  }

  getItem(i){
    if(this.inventory[i]){
      return this.inventory[i];
    }
  }

  render(){
    for (let i = 0; i < 6; i++) {
      const $item = $("#item" + i);
      const $del = $("#item" + i + " .delete");
      const $eq = $("#item" + i + " .equip");

      $del.hide();
      $eq.hide();
      $item.removeClass("weapon");
      $item.removeClass("boots");
      $item.removeClass("amulet");
      $item.removeClass("armor");
      $item.removeClass("held");
      $item.removeClass("equipped");
      if(this.inventory[i]) {
        this.inventory[i].pos = i;
        switch(this.inventory[i].stat){
          case "att":
            $item.addClass("weapon");
            break;
          case "spd":
            $item.addClass("boots");
            break;
          case "maxHp":
            $item.addClass("amulet");
            break;
          case "def":
            $item.addClass("armor");
          break;
        }
        if(this.inventory[i].equipped){ $item.addClass("equipped"); }
        $item.addClass("held");
        $del.show();
        $eq.show();
      }
    }
  }
}
