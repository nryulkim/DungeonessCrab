import Board from './board';
import Assets from './util/asset_loader';

$("#how-to").hide();
$(".delete").hide();
$(".info").hide();
$("#leaderboard").hide();

let board;

document.addEventListener('DOMContentLoaded', () => {
  start();
  $("#restart").on("click", restart);
  $("#board").on("contextmenu", (e)=> { return false; });
});


function restart(){
  $(".buff-up").off();
  const player = board.game.player;
  player.saveChar();

  $("#end-modal").toggleClass("show");
  start();
}

function start(){
  let stage = new createjs.Stage("board");
  board = new Board(stage);
  board.start();
}
