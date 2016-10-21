import Game from './game';
import Assets from './util/asset_loader';
import { objEach } from './util/util_func';

export default class Board {
  constructor(stage){
    this.stage = stage;
    this.render = this.render.bind(this);
    this.run = this.run.bind(this);
    this.levelScreen = $("#modal");
    $(".close").on("click", () => {
      this.game.paused = false;
      this.levelScreen.toggleClass("show");
    });
  }

  start(){
    this.assets = new Assets(this.render);
  }

  run(){
    const { game, stage } = this;
    if(game.player.gameOver){
      window.clearInterval(this.interval);
      $("#end-modal").toggleClass("show");
    }else{
      this.game.tick();
      this.stage.update();
    }
  }

  render(){
    const board = this;
    this.game = new Game(this.stage, this.assets, this.levelScreen);

    const { game, stage, assets } = this;
    game.player.draw(stage);
    objEach(game.enemies, (enemy) => { enemy.draw(stage); });

    this.interval = window.setInterval(this.run, 30);
  }
}
