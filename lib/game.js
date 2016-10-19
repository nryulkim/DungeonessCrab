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
    this.enemy = new Enemy({
      name: "Crab",
      hp: 10,
      lvl: 1,
      att: 1,
      def: 1,
      pos: [30, 30],
      color: "#c00"
    });
  }

  tick(){
    const { player, enemy } = this;
    player.step();
    enemy.step();
  }

}
