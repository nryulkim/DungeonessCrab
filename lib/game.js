import Character from './chars/main';
import Enemy from './chars/enemy';
import {
  objEach, normalize, isCircleRectCollide, isCircle2Collide
} from './util/util_func';

export default class Game{
  constructor(stage, assets){
    this.level = 1;
    this.stage = stage;
    this.assets = assets;
    this.player = new Character({
      name: "Max",
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
      body: assets.char
    });
    this.enemies = {};
    this.createEnemies();
  }

  tick(){
    const { player, enemies, stage } = this;
    player.step();
    this.checkCollisions();
    objEach(enemies, (enemy) => { enemy.step(); });
    if(Object.keys(enemies).length === 0){
      this.nextLevel();
    }
  }


  checkCollisions(){
    const { player, stage, enemies } = this;
    objEach(enemies, (enemy) => {
      if(isCircleRectCollide(enemy.hitBox, player.hitBox)){
        const vec = normalize(player.pos, enemy.pos);
        const body = player.takeDmg(enemy.att, vec);
        if(body){
          player.die();
        }
      }

      if(player.attacking && !player.attacked){
        if(isCircle2Collide(player.swingBox, enemy.hitBox)){
          const vec = normalize(enemy.pos, player.pos);
          const body = enemy.takeDmg(player.att, vec);
          if(body && !player.attacked){
            delete enemies[enemy.name];
            stage.removeChild(body);
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
        hp: lvl,
        lvl: lvl,
        att: lvl,
        def: lvl,
        exp: lvl/2,
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
