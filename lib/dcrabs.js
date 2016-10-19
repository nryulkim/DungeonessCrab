import Board from './board';


document.addEventListener('DOMContentLoaded', () => {
  const stage = new createjs.Stage("board");
  const board = new Board(stage);
  board.start();
});
