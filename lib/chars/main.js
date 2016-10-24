import Entity from './entity_obj';
import UserDisplay from '../user_display';
import Inventory from './inventory/inventory';
import Item from './inventory/item';
import { getSkew, objEach } from '../util/util_func';

const VERSION = "1.0.0";

export default class Character extends Entity{
  constructor(options){
    super(options);
    this.destroyCrabs = options.destroyCrabs;
    this.equipped = {};
    this.stepsound = options.step;
    this.level = options.level;
    this.swing = options.swing;
    this.pause = options.pause;
    this.unpause = options.unpause;
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
    this.startAttacking = this.startAttacking.bind(this);
    this.stopAttacking = this.stopAttacking.bind(this);
    this.trackMouse = this.trackMouse.bind(this);
    this.mouseDown = false;
    this.mouse = {
      offsetX: null,
      offsetY: null
    };
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
    $(".info").on("click", this.toggleEquip);
    $(".delete").on("click", this.removeItem);
  }

  setItems(name){
    const char = JSON.parse(localStorage.getItem(name));
    this.prestige = {
      tokens: 0,
      buffs: {
        maxHp: 1,
        att: 1,
        def: 1,
        spd: 1
      }
    };
    let buffs = this.prestige.buffs;
    if(char && char.items && char.version === VERSION){
      const items = char.items;
      this.prestige = char.prestige;
      buffs = this.prestige.buffs;

      const stats = ["maxHp", "att", "def", "spd"];
      for (let i = 0; i < stats.length; i++) {
        const statBuff = buffs[stats[i]];
        if(statBuff > 1){
          this[stats[i]] *= (12*Math.log(buffs[stats[i]] + 8) -10)/10;
        }
      }

      for (let i = 0; i < items.length; i++) {
        const item = new Item(items[i]);
        this.inventory.addItem(item);
        this.equip(item, i);
      }
    }

    $(".maxHpBuff .multiplier").text(Math.floor(12*Math.log(buffs.maxHp + 9) -10)/10 + "x");
    $(".attBuff .multiplier").text(Math.floor(12*Math.log(buffs.att + 9) -10)/10 + "x");
    $(".defBuff .multiplier").text(Math.floor(12*Math.log(buffs.def + 9) -10)/10 + "x");
    $(".spdBuff .multiplier").text(Math.floor(12*Math.log(buffs.spd + 9) -10)/10 + "x");

    $(".maxHpBuff .price").text("$ " + Math.floor(Math.exp(buffs.maxHp / 2) + 10));
    $(".attBuff .price").text("$ " + Math.floor(Math.exp(buffs.att / 2) + 10));
    $(".defBuff .price").text("$ " + Math.floor(Math.exp(buffs.def / 2) + 10));
    $(".spdBuff .price").text("$ " + Math.floor(Math.exp(buffs.spd / 2) + 10));
  }

  invincible(){
    const player = this;
    this.invic = true;
    window.setTimeout(() => player.invic = false, 500);
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
    const idx = e.currentTarget.dataset.id;
    const item = this.inventory.getItem(idx);
    if(this.equipped[item.id]){
      this.unequip(item, idx);
    }else{
      this.equip(item, idx);
    }
  }

  equip(item, idx){
    if(item.stat === "PBomb"){
      this.destroyCrabs(item.val);
      this.inventory.removeItem(item.pos);
    }else if(item.stat === "pot"){
      this.hp += item.val;
      if(this.hp > this.maxHp){
        this.hp = this.maxHp;
      }
      this.inventory.removeItem(item.pos);
      this.display.update(this);
    }else if(Object.keys(this.equipped).length < 3){
      this.equipped[item.id] = item;
      this[item.stat] += item.val;
      this.display.update(this);
      item.equipped = true;
      $("#item" + idx).addClass("equipped");
    }
  }

  unequip(item, idx){
    this[item.stat] -= item.val;
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
    if(this.hp > this.maxHp){
      this.hp = this.maxHp;
    }

    if(!attacking && !dead){
      objEach(keys, (key) => {
        if(key){
          if(key === 87){
            char.checkAnimation("moveU");
            char.move([0,-1]);
            char.stepsound.play();
          }else if(key === 65){
            char.checkAnimation("moveL");
            char.move([-1, 0]);
            char.stepsound.play();
          }else if(key === 83){
            char.checkAnimation("moveD");
            char.move([0, 1]);
            char.stepsound.play();
          }else if(key === 68){
            char.checkAnimation("moveR");
            char.move([1, 0]);
            char.stepsound.play();
          }
        }
      });
      if(this.mouseDown){
        this.attack();
      }
    }
    this.hitBox.x = this.pos[0] + 7;
    this.hitBox.y = this.pos[1] + 6;
  }

  die(tokens){
    if(!this.dead){
      this.body.addEventListener("animationend", this.removeBody);
      this.body.gotoAndPlay("warpout");
      this.dead = true;

      $(".info").off("click", this.toggleEquip);
      $(".delete").off("click", this.removeItem);
      $("#how-to-button").off();
      $("#how-to-close").off();
      $("#leaderboard-close").off();
      $("#leaderboard-button").off();
      this.useTokens(tokens * -1);
    }
  }

  useTokens(tokens){
    this.prestige.tokens -= tokens;
    $("#tokens").text("$ " + this.prestige.tokens);
  }

  getEquipped(){
    const items = [];
    const keys = Object.keys(this.equipped);
    for (let i = 0; i < keys.length; i++) {
      items.push(this.equipped[keys[i]]);
    }

    const char = {
      lvl: this.lvl,
      prestige: this.prestige,
      items: items,
      version: VERSION
    };
    return JSON.stringify(char);
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
    $("#end-modal").toggleClass("show");
    $(".buff-up").on("click", this.handleAddBuff.bind(this));

    this.gameOver = true;

  }

  handleAddBuff(e){
    e.preventDefault();
    const stat = e.target.dataset.type;
    const price = parseInt($(e.target).prev().text().slice(2));
    if(this.prestige.tokens >= price){
      this.prestige.tokens -= price;
      this.prestige.buffs[stat] += 1;
      $("#tokens").text(this.prestige.tokens);
      $("." + stat + "Buff .multiplier").text(Math.floor(12*Math.log(this.prestige.buffs[stat] + 9) -10)/10 + "x");
      $("." + stat + "Buff .price").text("$ " + Math.floor(Math.exp(this.prestige.buffs[stat] / 2) + 10));
    }
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
    this.mouseDown = false;
    this.lvl += 1;
    this.maxHp += 2;
    this.exp = 0;
    this.attr = 4;
    this.expToLevel = this.lvl * this.lvl;
    this.display.update(this);
    this.pause();

    $(".plus").on("click", this.handleStatUp);
    this.levelScreen.toggleClass("show");
  }

  receiveStats(){
    this.unpause();
    this.display.update(this);
  }

  attack(e){
    const { swing, stage, pos } = this;
    if(!this.attacking){
      const skew = getSkew(this.offsetX, this.offsetY, pos[0], pos[1]);
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
    $("#board").mousedown(this.startAttacking);
    $("#board").mouseup(this.stopAttacking);
    $("#board").mousemove(this.trackMouse);
  }

  startAttacking(e){
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;
    this.mouseDown = true;
  }

  trackMouse(e){
    if(!this.mouseDown){ return; }
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;
  }

  stopAttacking(e){
    this.mouseDown = false;
  }

  useKey(e){
    if(e.keyCode == "33"){
      e.preventDefault();
    }
    const keys = this.keys;
    if(Object.keys(keys).includes(e.keyCode.toString())){
      keys[e.keyCode] = e.keyCode;
    }
  }

  stopKey(e){
    if(e.keyCode == "33"){
      e.preventDefault();
    }
    const keys = this.keys;
    if(Object.keys(keys).includes(e.keyCode.toString())){
      keys[e.keyCode] = false;
    }
  }

  handleStatUp(e){
    const stat = e.currentTarget.dataset.stat;
    this[stat] += (0.2*this.prestige.buffs[stat]) + 0.8;
    this.attr -= 1;
    this.display.update(this);

    if(this.attr <= 0){
      $(".plus").off("click", this.handleStatUp);
      this.levelScreen.toggleClass("show");
      this.receiveStats();
    }
  }
}
