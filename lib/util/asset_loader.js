export default class Assets {
  constructor(callback){
    this.callback = callback;
    this.manifest = [
      {src: "sword_swing.png", id: "swing"}
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
        attack: [0, 12, "attack"]
      }
    }));
    this.callback();
  }
}
