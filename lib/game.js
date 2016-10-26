import Character from './chars/main';
import Enemy from './chars/enemy';
import Map from './map/map';
import {
  objEach, normalize, isCircleRectCollide, isCircle2Collide, distance
} from './util/util_func';

export default class Game{
  constructor(stage, assets, levelScreen, sounds){
    this.sounds = sounds;
    this.level = 1;
    this.stage = stage;
    this.assets = assets;
    this.paused = true;
    this.player = new Character({
      name: "",
      hp: 2,
      lvl: 1,
      att: 1,
      def: 1,
      spd: 5,
      exp: 0,
      expToLevel: 2,
      pos: [250, 250],
      color: "#0c0",
      stage: stage,
      swing: assets.swing,
      body: assets.char,
      levelScreen: levelScreen,
      pause: this.pause.bind(this),
      unpause: this.unpause.bind(this),
      sounds: {
        level: this.sounds.level,
        step: this.sounds.step
      },
      blowUp: this.blowUp.bind(this),
    });
    this.enemies = {};
    this.tokens = 0;
    this.items = [];
    this.floors = [];
    this.walls = [];
    this.setName = this.setName.bind(this);
    this.addItem = this.addItem.bind(this);
    this.createEnemies();
    $("#initial-modal").toggleClass("show");
    $("#start").on("click", this.setName);
    this.drawFloor();
    this.setHowTo();
    this.setLeader();
    this.removeBomb = this.removeBomb.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.crabAttackCollision = this.crabAttackCollios.bind(this);
    this.attackCollision = this.attackCollision.bind(this);


    this.map = new Map(5);
  }

  addToken(){
    this.tokens += 1;
  }

  blowUp(r){
    const { player, enemies, stage } = this;
    const dead = [];
    const boom = this.assets.boom;
    const xScale = (0.03704 * r) + 0.44444;
    const yScale = (0.04167 * r) + 0.5;
    boom.scaleX = xScale;
    boom.scaleY = yScale;
    boom.x = player.pos[0]-(110*xScale);
    boom.y = player.pos[1]-(120*yScale);
    boom.addEventListener("animationend", this.removeBomb);
    this.stage.addChild(boom);
    boom.gotoAndPlay("boom");
    this.sounds.pbomb.play();
    objEach(enemies, (enemy) => {
      if(distance(enemy.pos, player.pos) < 60 + (r * 5)){
        dead.push(enemy);
        enemy.takeDmg(50, [0,0]);
        player.gainExp(enemy.exp);
      }
    });

    for (let i = 0; i < dead.length; i++) {
      delete enemies[dead[i].name];
    }
  }

  removeBomb(){
    const boom = this.assets.boom;
    boom.removeEventListener("animationend", this.removeBomb);
    this.stage.removeChild(boom);
  }

  setHowTo(){
    const $howto = $("#how-to");
    const game = this;
    $("#how-to-button").on("click", (e) => {
      e.preventDefault();
      game.pause();
      $howto.show();
    });

    $("#how-to-close").on("click", (e) => {
      e.preventDefault();
      game.paused = false;
      $howto.hide();
    });
  }

  setLeader(){
    const $board = $("#leaderboard");
    const game = this;
    $("#leaderboard-button").on("click", (e) => {
      e.preventDefault();
      game.pause();
      $board.show();
    });
    $("#leaderboard-close").on("click", (e) => {
      e.preventDefault();
      game.paused = false;
      $board.hide();
    });
  }


  drawFloor(){
    for (let i = 0; i < 20; i++) {
      for(let j = 0; j < 20; j++){
        let obj;
        let prop;
        if(j === 0 || j === 19 || i === 0 || i === 19){
          obj = new createjs.Bitmap(this.assets.generateRandomWall());
          prop = "walls";
        }else{
          obj = new createjs.Bitmap(this.assets.generateRandomFloor());
          prop = "floors";
        }
        obj.scaleX = 0.52;
        obj.scaleY = 0.52;
        obj.x = 25*i;
        obj.y = 25*j;
        this[prop].push(obj);
        this.stage.addChild(obj);
      }
    }
  }
  updateFloor(){
    const { floors, walls, assets } = this;
    for (let i = 0; i < floors.length; i++) {
      floors[i].image = assets.generateRandomFloor();
    }
    for (let i = 0; i < walls.length; i++) {
      walls[i].image = assets.generateRandomWall();
    }
  }

  setName(e){
    e.preventDefault();
    const name = $("#name-input")[0].value;
    if(name === ""){
    }else{
      this.player.name = name;
      this.player.display.update(this.player);
      $("#initial-modal").toggleClass("show");
      $("#start").off("click", this.setName);
      $("input").blur();

      this.player.setDefaultStats(name);
      this.paused = false;
    }
  }

  tick(){
    const { player, enemies, stage, paused } = this;
    if(player.hp > 0){
      const pos = player.pos;
      if(!paused){
        player.step();
        this.checkCollisions();
        objEach(enemies, (enemy) => { enemy.step(pos); });
        if(Object.keys(enemies).length === 0){
          this.nextLevel();
        }
      }
    }
  }

  addItem(item){
    this.items.push(item);
  }

  removeItem(item){
    const { items } = this;
    for (let i = 0; i < items.length; i++) {
      if(items[i].id === item.id){
        items.splice(i,1);
        i --;
      }
    }
  }

  pause(){
    this.paused = true;
  }

  unpause(){
    this.paused = false;
    this.player.invincible();
  }

  checkCollisions(){
    const { player, stage, enemies, items } = this;
    this.itemCollision();
    objEach(enemies, (enemy) => {
      this.crabAttackCollision(enemy);
      this.attackCollision(enemy);
    });
  }

  crabAttackCollision(enemy){
    const { player, sounds } = this;

    if(!player.invic && isCircleRectCollide(enemy.hitBox, player.hitBox)){
      const vec = normalize(player.pos, enemy.pos);
      const body = player.takeDmg(enemy.att, vec);
      player.invincible();
      sounds.hit2.play();
      if(body){
        sounds.death.play();
        player.die(this.tokens);
      }
    }
  }

  itemCollision(){
    const { player, stage, items } = this;

    for (let i = 0; i < items.length; i++) {
      if(isCircleRectCollide(items[i].hitBox, player.hitBox)){
        items[i].pickUp(stage, player.inventory);
        items.splice(i, 1);
        i --;
      }
    }
  }

  attackCollision(enemy){
    const { player, sounds } = this;

    if(player.attacking && !player.attacked){
      if(isCircle2Collide(player.swingBox, enemy.hitBox)){
        const vec = normalize(enemy.pos, player.pos);
        const body = enemy.takeDmg(player.att, vec);
        sounds.hit.play();
        if(body && !player.attacked){
          sounds.crab_death.play();
          delete enemies[enemy.name];
          player.gainExp(enemy.exp);
        }
        player.attacked = true;
      }
    }
  }

  getEnemies(){
    this.currentRoom.getEnemies(this.player.pos);
  }

  nextLevel(){
    const game = this;
    const { stage, enemies } = this;
    this.level += 1;
    this.paused = true;
    window.setTimeout(()=>{
      if($("#modal").css("opacity") === "0") {
        game.unpause();
      }
     }, 1000);
    this.updateFloor();
    this.createEnemies();
    objEach(enemies, (enemy) => { enemy.draw(stage); });
  }
}
