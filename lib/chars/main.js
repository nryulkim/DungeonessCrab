import Entity from './entity_obj';
import UserDisplay from '../user_display';
import Inventory from './inventory/inventory';
import { getSkew, objEach } from '../util/util_func';
import { DEFAULT_PRESTIGE, VERSION, STATS, db } from '../util/constants';

export default class Character extends Entity{
  constructor(options){
    super(options);
    this.setBinds();
    this.setKeys();
    this.bindKeys();
    this.sounds = options.sounds;
    this.swing = options.swing;
    this.pause = options.pause;
    this.unpause = options.unpause;
    this.display = new UserDisplay(this);
    this.body = options.body;
    this.invic = false;
    this.expToLevel = options.expToLevel;
    this.attr = 0;
    this.animation = "warpin";
    this.attacking = false;
    this.attacked = false;
    this.levelScreen = options.levelScreen;
    this.inventory = new Inventory(
      this.updateDisplay,
      this.addStat,
      options.blowUp
    );
    this.mouseDown = false;
    this.mouse = {
      offsetX: null,
      offsetY: null
    };

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
  }

  addStat(stat, val){
    this[stat] += val;
    if(stat === "hp" && this.hp > this.maxHp){
      this.hp = this.maxHp;
    }
  }

  setDefaultStats(obj){
    const char = obj.val();
    this.prestige = DEFAULT_PRESTIGE;
    let buffs = this.prestige.buffs;
    let max = 0;
    if(char && char.version === VERSION){
      let items = [];
      if(char.items){
        items = char.items;
      }
      this.prestige = char.prestige;
      buffs = this.prestige.buffs;
      max = char.lvl;

      for (let i = 0; i < STATS.length; i++) {
        const statBuff = buffs[STATS[i]];
        if(statBuff > 1){
          this[STATS[i]] *= (13*Math.log(buffs[STATS[i]] + 8) - 12)/5;
        }
      }
      this.inventory.setItems(items);
    }else{
      db.ref(`/users/${this.name}`).set({
        name: this.name,
        lvl: 1,
        items: [],
        prestige: this.prestige,
        version: VERSION
      });
    }
    this.max = max;
    this.setDefaults(buffs);
  }

  setDefaults(buffs){
    for (let i = 0; i < STATS.length; i++) {
      $(`.${STATS[i]}Buff .multiplier`).text(
        Math.floor(13*Math.log(buffs[STATS[i]] + 8) - 12)/5 + "x"
      );

      $(`.${STATS[i]}Buff .price`).text(
        "$ " + Math.floor(Math.exp(buffs[STATS[i]] / 2) + 10)
      );
    }
  }

  updateDisplay(){
    this.display.update(this);
  }

  invincible(){
    const player = this;
    this.invic = true;
    player.changeAnim = false;
    this.body.gotoAndPlay("invic");
    window.setTimeout(() => {
      player.body.gotoAndPlay("stand");
      player.animation = "stand";
      player.changeAnim = true;
      player.invic = false;
    }, 500);
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

  die(tokens){
    if(!this.dead){
      window.oncontextmenu = () => { return true; };

      this.body.addEventListener("animationend", this.removeBody);
      this.body.gotoAndPlay("warpout");
      this.dead = true;

      $(".info").off();
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

  saveChar(){
    const items = [];
    const { equipped } = this.inventory;
    const keys = Object.keys(equipped);
    for (let i = 0; i < keys.length; i++) {
      const itemProps = {
        stat: equipped[keys[i]].stat,
        val: equipped[keys[i]].val
      };
      items.push(itemProps);
    }
    let level = this.lvl > this.max ? this.lvl : this.max;
    const char = {
      lvl: level,
      prestige: this.prestige,
      items: items,
      version: VERSION
    };

    if(this.lvl > this.low && this.lvl > this.max){
      db.ref(`leaderboard/${this.name}`).set(this.lvl);
    }

    db.ref().update({
      [`/users/${this.name}`]: char
    });
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

  step(){
    const char = this;
    const { keys, attacking, dead } = char;
    if(this.hp > this.maxHp){
      this.hp = this.maxHp;
    }
    if(!attacking && !dead){
      objEach(keys, (key) => {
        if(key){
          const step = this.sounds.step;
          if(key === 87){
            char.checkAnimation("moveU");
            char.move([0,-1]);
            step.play();
          }else if(key === 65){
            char.checkAnimation("moveL");
            char.move([-1, 0]);
            step.play();
          }else if(key === 83){
            char.checkAnimation("moveD");
            char.move([0, 1]);
            step.play();
          }else if(key === 68){
            char.checkAnimation("moveR");
            char.move([1, 0]);
            step.play();
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

  checkAnimation(anim){
    const currAnim = this.body.currentAnimation;
    if(
      currAnim !== anim &&
      currAnim !== "moveU" &&
      currAnim !== "moveD" &&
      currAnim !== "invic"
    ){
      this.animation = anim;
      this.changeAnim = true;
    }
  }

  gainExp(exp){
    this.exp += exp;
    if(this.exp >= this.expToLevel){
      this.levelUp();
    }
    this.display.update(this);
  }

  levelUp(){
    this.sounds.level.play();
    this.mouseDown = false;
    this.lvl += 1;
    this.maxHp += (0.4*this.prestige.buffs.maxHp) + 1.6;
    this.hp += (0.4*this.prestige.buffs.maxHp) + 1.6;
    this.exp = 0;
    this.attr = 4;
    this.newStats = {
      att: 0,
      def: 0,
      spd: 0
    };

    this.expToLevel = this.lvl * this.lvl;
    this.display.update(this);
    this.pause();

    $(".plus").on("click", this.handleStatUp);
    $(".neg").on("click", this.handleStatDown);
    $("#close-level").on("click", this.handleCloseLevelUp);
    this.levelScreen.toggleClass("show");
  }

  handleStatUp(e){
    if(this.attr > 0){
      const stat = e.currentTarget.dataset.stat;
      this[stat] += (0.2*this.prestige.buffs[stat]) + 0.8;
      this.attr -= 1;
      this.newStats[stat] += 1;
      this.display.update(this);
    }
  }

  handleStatDown(e){
    const stat = e.currentTarget.dataset.stat;
    if(this.attr < 4 && this.newStats[stat] > 0){
      this[stat] -= (0.2*this.prestige.buffs[stat]) + 0.8;
      this.attr += 1;
      this.newStats[stat] -= 1;
      this.display.update(this);
    }
  }

  handleCloseLevelUp(){
    if(this.attr === 0){
      $(".plus").off("click", this.handleStatUp);
      $(".neg").off("click", this.handleStatDown);

      $("#close-level").off();
      this.levelScreen.toggleClass("show");
      this.unpause();
      this.display.update(this);
    }
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

  setBinds(){
    this.removeSwing = this.removeSwing.bind(this);
    this.removeBody = this.removeBody.bind(this);
    this.useKey = this.useKey.bind(this);
    this.stopKey = this.stopKey.bind(this);
    this.attack = this.attack.bind(this);
    this.handleStatUp = this.handleStatUp.bind(this);
    this.handleStatDown = this.handleStatDown.bind(this);
    this.startAttacking = this.startAttacking.bind(this);
    this.stopAttacking = this.stopAttacking.bind(this);
    this.trackMouse = this.trackMouse.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.addStat = this.addStat.bind(this);
    this.handleCloseLevelUp = this.handleCloseLevelUp.bind(this);
    this.setDefaultStats = this.setDefaultStats.bind(this);
  }
}
