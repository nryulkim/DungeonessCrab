import Character from './chars/main';
import Enemy from './chars/enemy';

export default class Game{
  constructor(stage, assets){
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
      swing: assets.swing
    });
    this.createEnemies();
  }

  tick(){
    const { player, enemies, stage } = this;
    const objs = this.allObjects();
    player.step();
    if(player.attacking){
      this.checkCollisions(player.swing);
    }
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].step();
    }
  }


  checkCollisions(swing){
    const enemies = this.enemies;
    for (let i = 0; i < enemies.length; i++) {
      if(ndgmr.checkPixelCollision(swing,enemies[i].body)){
      }
    }
  }

  allObjects(){
    return [this.player].concat(this.enemies);
  }

  createEnemies(){
    this.enemies = [];
    for (let i = 0; i < 5; i++) {
      this.enemies.push(
        this.enemy = new Enemy({
          name: "Crab" + i,
          hp: 10,
          lvl: 1,
          att: 1,
          def: 1,
          pos: [25*i, 25*i],
          color: "#c00"
        })
      );
    }
  }

}
