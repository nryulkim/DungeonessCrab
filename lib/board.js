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
      level: new Audio("./assets/sounds/level.ogg"),
      hit2: new Audio("./assets/sounds/hit2.ogg"),
      step: new Audio("./assets/sounds/step.ogg"),
      pbomb: new Audio("./assets/sounds/pbomb.wav"),
      door: new Audio("./assets/sounds/door.ogg"),
      next_level: new Audio("./assets/sounds/next_level.ogg")
    };

    this.backgroundMusic.play();

    this.backgroundMusic.addEventListener("ended", () => {
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.play();
    }, true);
  }

  updateBoard(){
    const chars = [];
    for ( let i = 0; i < localStorage.length; i++ ) {
      const name = localStorage.key(i);
      chars.push({[name]: JSON.parse(localStorage.getItem(name))});
    }

    chars.sort((a, b) => {
      if(a.lvl > b.lvl){
        return 1;
      }else{
        return -1;
      }
    });

    const $board = $("#leaderboard .list");
    $board.empty();
    let list = chars.length > 10 ? 10 : chars.length;
    for (let j = 0; j < list; j++) {
      const LBitem = $("<div>").addClass("leader-board-item");
      const name = Object.keys(chars[j])[0];
      LBitem.append($("<li>").text(j+1 + ". " + name));
      LBitem.append($("<li>").text("Level "+chars[j][name].lvl));
      $board.append(LBitem);
    }
  }

  start(){
    this.assets = new Assets(this.render);
    this.updateBoard();
  }

  run(){
    const { game, stage } = this;
    if(game.player.gameOver){
      this.stage.removeAllChildren();
      this.ticker.removeAllEventListeners("tick");
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
    objEach(game.getEnemies(), (enemy) => { enemy.draw(stage); });

    this.ticker.addEventListener("tick", this.run);
  }
}
