import { sample } from "./util_func";

export default class Assets {
  constructor(callback){
    this.callback = callback;
    this.manifest = [
      {src: "sword_swing.png", id: "swing"},
      {src: "crab.png", id: "crab"},
      {src: "character.png", id: "char"},
      {src: "floors/floor1.png", id: "f1"},
      {src: "floors/floor2.png", id: "f2"},
      {src: "floors/floor3.png", id: "f3"},
      {src: "floors/wall1.webp", id: "w1"},
      {src: "floors/wall2.webp", id: "w2"},
      {src: "bag.png", id: "bag"}
    ];
    this.loader = this.loader || new createjs.LoadQueue(false);
    this.handleComplete = this.handleComplete.bind(this);
    this.newBag = this.newBag.bind(this);
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
        attack: [0, 11, "attack", 0.7]
      }
    }));
    this.char = new createjs.Sprite(new createjs.SpriteSheet({
      images: [loader.getResult("char")],
      frames: {
        width: 32, height: 32,
        regX: 0, regY: 0
      },
      animations: {
        stand: [3, 3],
        standl: [0, 0],
        standr: [1, 1],
        standd: [2, 2],
        moveL: [12, 18, "standl", 0.2],
        moveR: [24, 30, "standr", 0.2],
        moveD: [36, 42, "standd", 0.2],
        moveU: [48, 51, "stand", 0.2],
        warpout: [60, 71, "warpin", 0.2],
        warpin: [72, 83, "stand"]
      }
    }));
    this.floors = [
      loader.getResult("f1"),
      loader.getResult("f2"),
      loader.getResult("f3")
    ];

    this.walls = [
      loader.getResult("w1"),
      loader.getResult("w2")
    ];

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
        stand: [0, 3, "stand", 0.15],
        moveR: [4, 7, "moveR", 0.15],
        die:   [24, 27, "die", 0.15]
      }
    }));
  }

  generateRandomFloor(){
    return sample(this.floors);
  }
  generateRandomWall(){
    return sample(this.walls);
  }

  newBag(){
    return new createjs.Bitmap(this.loader.getResult("bag"));
  }
}
