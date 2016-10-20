import Character from './chars/main';
import Enemy from './chars/enemy';
import { objEach } from './util/util_func';

export default class Game{
  constructor(stage, assets){
    this.stage = stage;
    this.assets = assets;
    this.player = new Character({
      name: "Max",
      hp: 10,
      lvl: 1,
      att: 1,
      def: 1,
      pos: [250, 250],
      color: "#0c0",
      stage: stage,
      swing: assets.swing,
      body: assets.char
    });
    this.createEnemies();
  }

  tick(){
    const { player, enemies, stage } = this;
    player.step();
    if(player.attacking && !player.attacked){
      this.checkCollisions(player);
    }
    objEach(enemies, (enemy) => { enemy.step(); });
  }


  checkCollisions(player){
    const { stage, enemies } = this;
    objEach(enemies, (enemy) => {
      if(ndgmr.checkPixelCollision(player.swing, enemy.body)){
        console.log("COLLIDED");
        const body = enemy.takeDmg(player.att);
        if(body && !player.attacked){
          delete enemies[enemy.name];
          stage.removeChild(body);
          player.levelUp();
        }
        player.attacked = true;
      }
    });
  }

  createEnemies(){
    this.enemies = {};
    for (let i = 0; i < 5; i++) {
      const enemy = new Enemy({
        name: "Crab" + i,
        hp: 10,
        lvl: 1,
        att: 1,
        def: 1,
        pos: [25*i, 25*i],
        color: "#c00",
        crab: this.assets.generateCrab()
      });
      this.enemies[enemy.name] = enemy;
    }
  }

}
