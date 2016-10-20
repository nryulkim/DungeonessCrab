import Character from './chars/main';
import Enemy from './chars/enemy';
export default class Game{
  constructor(stage){
    this.player = new Character({
      name: "Max",
      hp: 10,
      lvl: 1,
      att: 1,
      def: 1,
      pos: [250, 250],
      color: "#0c0",
      stage: stage
    });

    this.createEnemies();
  }

  tick(){
    const { player, enemies } = this;
    const objs = this.allObjects();
    player.step();
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].step();
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
