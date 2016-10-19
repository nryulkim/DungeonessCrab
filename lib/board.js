import Game from './game';

export default class Board {
  constructor(stage){
    this.stage = stage;
    this.game = new Game();
  }

  start(){
    const board = this;
    const { game, stage } = this;
    const objs = game.allObjects();
    for(let i = 0; i < objs.length; i ++){
      objs[i].draw(stage);
    }

    this.interval = window.setInterval(function(){
      game.tick();
      board.render();
    }, 30);
  }

  render(){
    this.stage.update();
  }
}
