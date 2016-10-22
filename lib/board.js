import Game from './game';
import Assets from './util/asset_loader';
import { objEach } from './util/util_func';

export default class Board {
  constructor(stage){
    this.stage = stage;
    this.ticker = createjs.Ticker;
    this.ticker.framerate = 60;
    this.render = this.render.bind(this);
    this.run = this.run.bind(this);
    this.levelScreen = $("#modal");
    $(".close").on("click", () => {
      this.game.paused = false;
      this.levelScreen.toggleClass("show");
    });

    this.backgroundMusic = new Audio("./assets/sounds/background.wav");
    this.gameSounds = {
      hit: new Audio("./assets/sounds/hit.ogg"),
      death: new Audio("./assets/sounds/death.ogg"),
      crab_death: new Audio("./assets/sounds/crab_death.ogg"),
      level: new Audio("./assets/sounds/level.ogg")
    };

    this.backgroundMusic.play();

    this.backgroundMusic.addEventListener("ended", () => {
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.play();
    }, true);
  }

  start(){
    this.assets = new Assets(this.render);
  }

  run(){
    const { game, stage } = this;
    if(game.player.gameOver){
      this.stage.removeAllChildren();
      this.ticker.removeAllEventListeners("tick");
      $("#end-modal").toggleClass("show");
    }else{
      this.game.tick();
      this.stage.update();
    }
  }

  render(){
    const board = this;
    this.game = new Game(this.stage, this.assets, this.levelScreen, this.gameSounds);

    const { game, stage, assets } = this;
    game.player.draw(stage);
    objEach(game.enemies, (enemy) => { enemy.draw(stage); });

    this.ticker.addEventListener("tick", this.run);
  }
}
