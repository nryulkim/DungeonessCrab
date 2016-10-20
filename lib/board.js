import Game from './game';
import Assets from './util/asset_loader';

export default class Board {
  constructor(stage){
    this.stage = stage;
    this.render = this.render.bind(this);
  }

  start(){
    this.assets = new Assets(this.render);
  }

  render(){
    const board = this;
    this.game = new Game(this.stage, this.assets);

    const { game, stage, assets } = this;
    const objs = game.allObjects();
    for(let i = 0; i < objs.length; i ++){
      objs[i].draw(stage);
    }

    this.interval = window.setInterval(function(){
      game.tick();
      stage.update();
    }, 30);
  }
}
