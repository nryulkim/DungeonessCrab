import Game from './game';

export default class Board {
  constructor(stage){
    this.stage = stage;
    this.game = new Game();
  }

  start(){
    const board = this;
    const { game } = this;
    this.interval = window.setInterval(function(){
      game.tick();
      board.render();
    }, 30);
  }

  render(){
    const { game, stage } = this;
    game.player.draw(stage);
    game.enemy.draw(stage);
  }
}
