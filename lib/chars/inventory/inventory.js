import { STATS } from '../../util/constants';
import Item from './item';

export default class Inventory{
  constructor(update, addStat, blowUp){
    this.blowUp = blowUp;
    this.addStat = addStat;
    this.update = update;
    this.inventory = [];
    this.equipped = {};
    this.removeItem = this.removeItem.bind(this);
    this.toggleEquip = this.toggleEquip.bind(this);
    $(".info").on("click", this.toggleEquip);
    $(".delete").on("click", this.removeItem);
    this.render();
  }

  setItems(items){
    for (let i = 0; i < items.length; i++) {
      const stats = Object.assign(items[i], {id: i});
      const item = new Item(stats);
      this.addItem(item);
      this.equip(item, i);
    }
  }

  remove(pos){
    this.inventory.splice(pos, 1);
    this.render();
  }

  removeItem(e){
    e.preventDefault();
    const idx = e.target.dataset.id;
    const item = this.getItem(idx);
    if(this.equipped[item.id]){
      this.unequip(item);
    }
    this.remove(idx);
  }

  toggleEquip(e){
    e.preventDefault();
    const idx = e.currentTarget.dataset.id;
    const item = this.getItem(idx);
    if(this.equipped[item.id]){
      this.unequip(item, idx);
    }else{
      this.use(item, idx);
    }
  }

  use(item, idx){
    if(item.stat === "PBomb"){
      this.blowUp(item.val);
      this.remove(item.pos);
    }else if(item.stat === "pot"){
      this.addStat("hp", item.val);
      this.remove(item.pos);
      this.update();
    }else{
      this.equip(item, idx);
    }
  }

  equip(item, idx){
    if(Object.keys(this.equipped).length < 3){
      this.equipped[item.id] = item;
      this.addStat(item.stat, item.val);
      if(item.stat === "maxHp"){
        this.addStat("hp", item.val);
      }
      this.update();
      item.equipped = true;
      $("#item" + idx).addClass("equipped");
    }
  }

  unequip(item, idx){
    this.addStat(item.stat, -item.val);
    delete this.equipped[item.id];
    if(item.stat === "maxHp"){
      this.addStat("hp", -item.val);
    }
    this.update();
    item.equipped = false;
    $("#item" + idx).removeClass("equipped");
  }

  addItem(item){
    if(this.inventory.length < 6){
      this.num ++;
      this.inventory.push(item);
      this.render();
    }
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
