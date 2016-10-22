import Entity from './entity_obj';
import UserDisplay from '../user_display';
import Inventory from './inventory/inventory';
import Item from './inventory/item';
import { getSkew, objEach } from '../util/util_func';

export default class Character extends Entity{
  constructor(options){
    super(options);
    this.equipped = {};
    this.level = options.level;
    this.swing = options.swing;
    this.pause = options.pause;
    this.inventory = new Inventory();
    this.body = options.body;
    this.invic = false;
    this.expToLevel = options.expToLevel;
    this.attr = 0;
    this.attrShow = $("#attr");
    this.animation = "warpin";
    this.setKeys();
    this.attacking = false;
    this.attacked = false;
    this.display = new UserDisplay(this);
    this.levelScreen = options.levelScreen;
    this.removeSwing = this.removeSwing.bind(this);
    this.removeBody = this.removeBody.bind(this);
    this.useKey = this.useKey.bind(this);
    this.stopKey = this.stopKey.bind(this);
    this.attack = this.attack.bind(this);
    this.handleStatUp = this.handleStatUp.bind(this);
    this.bindKeys();

    this.swingBox = {
      x: 0,
      y: 0,
      r: 20
    };
    this.hitBox = {
      x: this.pos[0] + 7,
      y: this.pos[1] + 6,
      w: 15,
      h: 24
    };
    this.toggleEquip = this.toggleEquip.bind(this);
    this.removeItem = this.removeItem.bind(this);
    $(".equip").on("click", this.toggleEquip);
    $(".delete").on("click", this.removeItem);
  }

  setItems(name){
    const items = JSON.parse(localStorage.getItem(name));
    if(!items){ return; }
    for (let i = 0; i < items.length; i++) {
      const item = new Item(items[i]);
      this.inventory.addItem(item);
    }
  }

  invincible(){
    const player = this;
    this.invic = true;
    window.setTimeout(() => player.invic = false, 1000);
  }

  removeItem(e){
    e.preventDefault();
    const idx = e.target.dataset.id;
    const item = this.inventory.getItem(idx);
    if(this.equipped[item.id]){
      this.unequip(item);
    }
    this.inventory.removeItem(idx);
  }

  toggleEquip(e){
    e.preventDefault();
    const idx = e.target.dataset.id;
    const item = this.inventory.getItem(idx);
    if(this.equipped[item.id]){
      this.unequip(item, idx);
    }else{
      this.equip(item, idx);
    }
  }

  equip(item, idx){
    if(Object.keys(this.equipped).length < 3){
      this.equipped[item.id] = item;
      this[item.stat] += item[item.stat];
      if(item.stat === "maxHp"){
        this.hp += item[item.stat];
      }
      this.display.update(this);
      item.equipped = true;
      $("#item" + idx).addClass("equipped");
    }
  }

  unequip(item, idx){
    this[item.stat] -= item[item.stat];
    if(item.stat === "maxHp"){
      this.hp -= item[item.stat];
    }
    delete this.equipped[item.id];
    this.display.update(this);
    item.equipped = false;
    $("#item" + idx).removeClass("equipped");
  }

  setKeys(){
    this.keys = {
      87: false,
      65: false,
      83: false,
      68: false
    };
  }

  takeDmg(att, dir){
    if(!this.dead){
      const val = super.takeDmg(att, dir);
      this.display.update(this);
      return val;
    }
  }

  step(){
    const char = this;
    const { keys, attacking, dead } = char;
    if(!attacking && !dead){
      objEach(keys, (key) => {
        if(key){
          if(key === 87){
            char.checkAnimation("moveU");
            char.move([0,-1]);
          }else if(key === 65){
            char.checkAnimation("moveL");
            char.move([-1, 0]);
          }else if(key === 83){
            char.checkAnimation("moveD");
            char.move([0, 1]);
          }else if(key === 68){
            char.checkAnimation("moveR");
            char.move([1, 0]);
          }
        }
      });
    }
    this.hitBox.x = this.pos[0] + 7;
    this.hitBox.y = this.pos[1] + 6;
  }

  die(){
    if(!this.dead){
      this.body.addEventListener("animationend", this.removeBody);
      this.body.gotoAndPlay("warpout");
      this.dead = true;
      localStorage.setItem(this.name, this.getEquipped());
      $(".equip").off("click", this.toggleEquip);
      $(".delete").off("click", this.removeItem);
    }
  }

  getEquipped(){
    const items = [];
    const keys = Object.keys(this.equipped);
    for (let i = 0; i < keys.length; i++) {
      items.push(this.equipped[keys[i]]);
    }

    return JSON.stringify(items);
  }

  gainExp(exp){
    this.exp += exp;
    if(this.exp >= this.expToLevel){
      this.levelUp();
    }
    this.display.update(this);
  }

  removeBody(){
    const { body, stage } = this;
    body.removeEventListener("animationend", this.removeBoddy);
    stage.removeChild(body);
    this.gameOver = true;
  }

  checkAnimation(anim){
    const currAnim = this.body.currentAnimation;
    if(currAnim !== anim && currAnim !== "moveU" && currAnim !== "moveD"){
      this.animation = anim;
      this.changeAnim = true;
    }
  }

  levelUp(){
    this.level.play();
    this.lvl += 1;
    this.maxHp += 2;
    this.hp = this.maxHp;
    this.exp = 0;
    this.attr = 4;
    this.expToLevel = this.lvl * this.lvl;
    this.display.update(this);
    this.pause();

    $(".plus").on("click", this.handleStatUp);
    this.levelScreen.toggleClass("show");
  }

  receiveStats(){
    this.pause();
    this.display.update(this);
  }

  attack(e){
    const { swing, stage, pos } = this;
    if(!this.attacking){
      const skew = getSkew(e.offsetX, e.offsetY, pos[0], pos[1]);
      this.attacking = true;
      this.adjustSwing(swing, skew, pos);
      stage.addChild(swing);
      this.skew += 20;
      swing.addEventListener("animationend", this.removeSwing);
      swing.gotoAndPlay("attack");
    }
  }


  adjustSwing(swing, skew, pos){
    const rads = skew * Math.PI / 180;
    const xAdj = (60*Math.cos(rads));
    const yAdj = (60*Math.sin(rads));
    swing.x = pos[0] + 15 - xAdj + yAdj/2;
    swing.y = pos[1] + 15 - yAdj - xAdj/2;
    this.swingBox.x = pos[0] + 15 - (32*Math.cos(rads));
    this.swingBox.y = pos[1] + 16 - (33*Math.sin(rads));
    swing.width = 50;
    swing.height = 50;
    swing.skewX = skew;
    swing.skewY = skew;
  }

  removeSwing(){
    const { swing, stage } = this;
    this.attacking = false;
    this.attacked = false;
    swing.removeEventListener("animationend", this.removeSwing);
    stage.removeChild(swing);
  }

  bindKeys(){
    document.addEventListener("keydown", this.useKey);
    document.addEventListener("keyup", this.stopKey);
    $("#board").on("click", this.attack);
  }

  useKey(e){
    const keys = this.keys;
    if(Object.keys(keys).includes(e.keyCode.toString())){
      keys[e.keyCode] = e.keyCode;
    }
  }

  stopKey(e){
    const keys = this.keys;
    if(Object.keys(keys).includes(e.keyCode.toString())){
      keys[e.keyCode] = false;
    }
  }

  handleStatUp(e){
    this[e.currentTarget.dataset.stat] += 1;
    this.attr -= 1;
    this.display.update(this);

    if(this.attr <= 0){
      $(".plus").off("click", this.handleStatUp);
      this.levelScreen.toggleClass("show");
      this.receiveStats();
    }
  }
}
