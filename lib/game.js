import Character from './chars/main';
import Enemy from './chars/enemy';
import {
  objEach, normalize, isCircleRectCollide, isCircle2Collide
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
      pause: this.pauseToggle(),
      level: this.sounds.level
    });
    this.enemies = {};
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
  }

  setHowTo(){
    const $howto = $("#how-to");
    const game = this;
    $howto.hide();
    $("#how-to-button").on("click", (e) => {
      e.preventDefault();
      game.paused = true;
      $howto.show();
    });

    $("#how-to-close").on("click", (e) => {
      e.preventDefault();
      game.paused = false;
      $howto.hide();
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

      this.player.setItems(name);
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

  pauseToggle(){
    const game = this;
    return () => {
      game.paused = !game.paused;
    };
  }

  checkCollisions(){
    const { player, stage, enemies, items } = this;
    objEach(enemies, (enemy) => {
      if(!player.invic && isCircleRectCollide(enemy.hitBox, player.hitBox)){
        const vec = normalize(player.pos, enemy.pos);
        const body = player.takeDmg(enemy.att, vec);
        player.invincible();
        this.sounds.hit.play();
        if(body){
          this.sounds.death.play();
          player.die();
        }
      }
      const currentItems = items.slice(0);
      for (let i = 0; i < currentItems.length; i++) {
        if(isCircleRectCollide(currentItems[i].hitBox, player.hitBox)){
          currentItems[i].pickUp(stage, player);
          items.splice(i,1);
        }
      }

      if(player.attacking && !player.attacked){
        if(isCircle2Collide(player.swingBox, enemy.hitBox)){
          const vec = normalize(enemy.pos, player.pos);
          const body = enemy.takeDmg(player.att, vec);
          this.sounds.hit.play();
          if(body && !player.attacked){
            this.sounds.crab_death.play();
            delete enemies[enemy.name];
            player.gainExp(enemy.exp);
          }
          player.attacked = true;
        }
      }
    });
  }

  createEnemies(){
    const lvl = this.level;
    for (let i = 0; i < lvl; i++) {
      const r1 = Math.floor(Math.random() * 390) + 60;
      const r2 = Math.floor(Math.random() * 390) + 60;
      const enemy = new Enemy({
        name: "Crab" + i,
        stage: this.stage,
        hp: lvl*2,
        lvl: lvl,
        att: lvl*1.5,
        def: lvl,
        exp: lvl/2,
        spd: lvl*0.8,
        pos: [r1, r2],
        color: "#c00",
        crab: this.assets.generateCrab(),
        newBag: this.assets.newBag,
        addItem: this.addItem
      });
      this.enemies[enemy.name] = enemy;
    }
  }

  nextLevel(){
    const game = this;
    const { stage, enemies } = this;
    this.level += 1;
    this.player.invincible();
    this.updateFloor();
    this.createEnemies();
    objEach(enemies, (enemy) => { enemy.draw(stage); });
  }
}
