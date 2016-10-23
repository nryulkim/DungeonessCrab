
export default class Inventory{
  constructor(){
    this.inventory = [];
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
      const $itemstat = $item.find(".info-stat");
      const $itemval = $item.find(".val");
      const $del = $("#item" + i + " .delete");
      const $info = $("#info" + i);

      $itemstat.text("");
      $itemval.text("");
      $del.hide();
      $info.hide();

      $item.removeClass("pot");
      $item.removeClass("bomb");
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
          case "PBomb":
            $item.addClass("bomb");
            break;
          case "pot":
            $item.addClass("pot");
            break;
        }
        if(this.inventory[i].equipped){ $item.addClass("equipped"); }
        $item.addClass("held");
        $itemstat.text(this.inventory[i].stat);
        $itemval.text(Math.floor(10*this.inventory[i].val)/10);
        $del.show();
        $info.show();
      }
    }
  }
}
