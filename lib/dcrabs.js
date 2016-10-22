import Board from './board';
import Assets from './util/asset_loader';

document.addEventListener('DOMContentLoaded', () => {
  start();
  $("#restart").on("click", restart);
  $("#board").on("contextmenu", (e)=> { return false; });
});


function restart(){
  $("#end-modal").toggleClass("show");
  start();
}

function start(){
  const stage = new createjs.Stage("board");
  const board = new Board(stage);
  board.start();
}
