import Character from './chars/main';
import Enemy from './chars/enemy';
import {
  objEach, normalize, isCircleRectCollide, isCircle2Collide
} from './util/util_func';

export default class Game{
  constructor(stage, assets, levelScreen, hit, death){
    this.hit = hit;
    this.death = death;
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
      exp: 0,
      expToLevel: 2,
      pos: [250, 250],
      color: "#0c0",
      stage: stage,
      swing: assets.swing,
      body: assets.char,
      levelScreen: levelScreen,
      pause: this.pauseToggle()
    });
    this.enemies = {};
    this.setName = this.setName.bind(this);
    this.createEnemies();
    $("#initial-modal").toggleClass("show");
    $("#start").on("click", this.setName);
  }

  setName(e){
    e.preventDefault();
    const name = $("#name-input")[0].value;
    this.player.name = name;
    this.player.display.update(this.player);
    $("#initial-modal").toggleClass("show");
    $("#start").off("click", this.setName);
    this.paused = false;
  }

  tick(){
    const { player, enemies, stage, paused } = this;
    if(!paused){
      player.step();
      this.checkCollisions();
      objEach(enemies, (enemy) => { enemy.step(); });
      if(Object.keys(enemies).length === 0){
        this.nextLevel();
      }
    }
  }

  pauseToggle(){
    const game = this;
    return () => {
      game.paused = !game.paused;
    };
  }

  checkCollisions(){
    const { player, stage, enemies } = this;
    objEach(enemies, (enemy) => {
      if(isCircleRectCollide(enemy.hitBox, player.hitBox)){
        const vec = normalize(player.pos, enemy.pos);
        const body = player.takeDmg(enemy.att, vec);
        this.hit.play();
        if(body){
          this.death.play();
          player.die();
        }
      }

      if(player.attacking && !player.attacked){
        if(isCircle2Collide(player.swingBox, enemy.hitBox)){
          const vec = normalize(enemy.pos, player.pos);
          const body = enemy.takeDmg(player.att, vec);
          this.hit.play();
          if(body && !player.attacked){
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
      const r1 = Math.floor(Math.random() * 500);
      const r2 = Math.floor(Math.random() * 500);
      const enemy = new Enemy({
        name: "Crab" + i,
        stage: this.stage,
        hp: lvl*2,
        lvl: lvl,
        att: lvl + lvl,
        def: lvl,
        exp: lvl,
        spd: lvl,
        pos: [r1, r2],
        color: "#c00",
        crab: this.assets.generateCrab()
      });
      this.enemies[enemy.name] = enemy;
    }
  }

  nextLevel(){
    const { stage, enemies } = this;
    this.level += 1;
    this.createEnemies();
    objEach(enemies, (enemy) => { enemy.draw(stage); });
  }
}
