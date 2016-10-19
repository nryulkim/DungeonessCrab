document.addEventListener('DOMContentLoaded', () => {
  const stage = new createjs.Stage("board");

  const circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  stage.update();
});
