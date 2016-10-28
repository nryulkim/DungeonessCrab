import Game from './game';
import Assets from './util/asset_loader';
import { objEach } from './util/util_func';
import { db } from './util/constants';

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

    this.updateBoard = this.updateBoard.bind(this);

    db.ref('users').once("value").then(this.updateBoard);
  }

  updateBoard(obj){
    const chars = [];
    const userObj = obj.val();
    const names = Object.keys(userObj);
    for (let i = 0; i < names.length; i++) {
      chars.push(Object.assign(userObj[names[i]], {name: names[i]}));
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
    const list = chars.length > 10 ? 10 : chars.length;
    for (let j = 0; j < list; j++) {
      const LBitem = $("<div>").addClass("leader-board-item");
      const name = chars[j].name;
      LBitem.append($("<li>").text(j+1 + ". " + name));
      LBitem.append($("<li>").text("Level "+chars[j].lvl));
      $board.append(LBitem);
    }
  }

  start(){
    this.assets = new Assets(this.render);
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
