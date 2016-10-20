export default class Assets {
  constructor(callback){
    this.callback = callback;
    this.manifest = [
      {src: "sword_swing.png", id: "swing"},
      {src: "crab.png", id: "crab"}
    ];
    this.loader = new createjs.LoadQueue(false);
    this.handleComplete = this.handleComplete.bind(this);
    this.setSprites();
  }


  setSprites(){
  	this.loader.addEventListener("complete", this.handleComplete);
  	this.loader.loadManifest(this.manifest, true, "./assets/art/");
  }


  handleComplete(){
    const { loader } = this;
    this.swing = new createjs.Sprite(new createjs.SpriteSheet({
      images: [loader.getResult("swing")],
      frames: {
        width: 50, height: 50,
        regX: 0, regY: 0
      },
      animations: {
        attack: [0, 11, "attack"]
      }
    }));
    this.callback();
  }

  generateCrab(){
    const { loader } = this;
    return new createjs.Sprite(new createjs.SpriteSheet({
      images: [loader.getResult("crab")],
      frames: {
        width: 32, height: 32,
        regX: 0, regY: 0
      },
      animations: {
        stand: [0, 3, "stand", 0.5],
        moveR: [4, 8, "moveR", 0.4]
      }
    }));
  }
}
