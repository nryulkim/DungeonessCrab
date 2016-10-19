import Character from './chars/main';
import Enemy from './chars/enemy';
export default class Game{
  constructor(){
    this.player = new Character({
      name: "Max",
      hp: 10,
      lvl: 1,
      att: 1,
      def: 1,
      pos: [50, 50],
      color: "#0c0"
    });

    this.createEnemies();
  }

  tick(){
    const { player, enemies } = this;
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
          pos: [10*i, 10*i],
          color: "#c00"
        })
      );
    }
  }

}
