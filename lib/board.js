import Game from './game';
import Assets from './util/asset_loader';
import { objEach } from './util/util_func';

export default class Board {
  constructor(stage){
    this.stage = stage;
    this.render = this.render.bind(this);
    this.run = this.run.bind(this);
  }

  start(){
    this.assets = new Assets(this.render);
  }

  run(){
    const { game, stage } = this;
    if(game.player.gameOver){
      window.clearInterval(this.interval);
      window.alert("Game Over!");
    }else{
      this.game.tick();
      this.stage.update();
    }
  }

  render(){
    const board = this;
    this.game = new Game(this.stage, this.assets);

    const { game, stage, assets } = this;
    game.player.draw(stage);
    objEach(game.enemies, (enemy) => { enemy.draw(stage); });

    this.interval = window.setInterval(this.run, 30);
  }
}
