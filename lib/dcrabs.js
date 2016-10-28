import Board from './board';
import Assets from './util/asset_loader';
import { db } from './util/constants';

let board;

document.addEventListener('DOMContentLoaded', () => {
  start();
  $("#how-to").hide();
  $(".delete").hide();
  $(".info").hide();
  $("#leaderboard").hide();
  $("#restart-button").on("click", restart);
  $("#board").on("contextmenu", (e)=> { return false; });
  // db.ref('users').on("value").then(board.updateBoard);
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
