import Character from './chars/main';
import Enemy from './chars/enemy';
import Map from './map/map';
import {
  objEach, normalize, isCircleRectCollide, isCircle2Collide, sample,
  isRectRectCollide
} from './util/util_func';

export default class Game{
  constructor(stage, assets, levelScreen, sounds){
    this.binder();
    this.notMoved = true;
    this.paused = true;
    this.sounds = sounds;
    this.level = 1;
    this.stage = stage;
    this.assets = assets;
    this.player = new Character({
      name: "",
      hp: 2,
      lvl: 1,
      att: 1,
      def: 1,
      spd: 5,
      exp: 0,
      expToLevel: 2,
      pos: [250, 250],
      color: "#0c0",
      stage: stage,
      swing: assets.swing,
      body: assets.char,
      levelScreen: levelScreen,
      pause: this.pause.bind(this),
      unpause: this.unpause.bind(this),
      sounds: {
        level: this.sounds.level,
        step: this.sounds.step
      },
      blowUp: this.blowUp.bind(this),
    });
    this.tokens = 0;
    this.items = [];
    $("#initial-modal").toggleClass("show");
    $("#start").on("click", this.setName);
    this.setHowTo();
    this.setLeaderboard();

    this.newMap();
  }

  crabFuncs(){
    return {
      stage: this.stage,
      addItem: this.addItem,
      removeItem: this.removeItem,
      addToken: this.addToken
    };
  }

  addToken(){
    this.tokens += 1;
  }

  blowUp(r){
    const { player, stage, currentRoom } = this;
    const enemies = this.getEnemies();
    const dead = [];
    const boom = this.assets.boom;
    const xScale = (0.03704 * r) + 0.44444;
    const yScale = (0.04167 * r) + 0.5;
    boom.scaleX = xScale;
    boom.scaleY = yScale;
    boom.x = player.pos[0]-(110*xScale);
    boom.y = player.pos[1]-(120*yScale);
    boom.addEventListener("animationend", this.removeBomb);
    this.stage.addChild(boom);
    boom.gotoAndPlay("boom");
    this.sounds.pbomb.play();
    objEach(enemies, (enemy) => {
      if(distance(enemy.pos, player.pos) < 60 + (r * 5)){
        dead.push(enemy);
        enemy.takeDmg(50, [0,0]);
        player.gainExp(enemy.exp);
      }
    });

    for (let i = 0; i < dead.length; i++) {
      currentRoom.removeEnemy(enemy.name);
    }
  }

  removeBomb(){
    const boom = this.assets.boom;
    boom.removeEventListener("animationend", this.removeBomb);
    this.stage.removeChild(boom);
  }

  setHowTo(){
    const $howto = $("#how-to");
    const game = this;
    $("#how-to-button").on("click", (e) => {
      e.preventDefault();
      game.pause();
      $howto.show();
    });

    $("#how-to-close").on("click", (e) => {
      e.preventDefault();
      game.paused = false;
      $howto.hide();
    });
  }

  setLeaderboard(){
    const $board = $("#leaderboard");
    const game = this;
    $("#leaderboard-button").on("click", (e) => {
      e.preventDefault();
      game.pause();
      $board.show();
    });
    $("#leaderboard-close").on("click", (e) => {
      e.preventDefault();
      game.paused = false;
      $board.hide();
    });
  }

  removeRoom(){
    const { stage } = this;
    const { floors, walls } = this.currentRoom;
    for (let i = 0; i < floors.length; i++) {
      stage.removeChild(floors[i]);
    }
    for (let i = 0; i < walls.length; i++) {
      stage.removeChild(walls[i]);
    }

    const enemies = this.getEnemies();
    objEach(enemies, (enemy) => { stage.removeChild(enemy.body); });
  }

  updateRoom(pos = [250, 250]){
    const { stage, currentRoom, player } = this;
    const { floors, walls } = this.currentRoom;
    player.invincible();
    player.pos = pos;
    player.body.x = pos[0];
    player.body.y = pos[1];
    currentRoom.setEnemies(player.pos);
    for (let i = 0; i < floors.length; i++) {
      stage.addChild(floors[i]);
      stage.setChildIndex(floors[i], 0);
    }
    for (let i = 0; i < walls.length; i++) {
      stage.addChild(walls[i]);
    }

    const enemies = this.getEnemies();
    objEach(enemies, (enemy) => { enemy.draw(stage); });
  }

  setName(e){
    e.preventDefault();
    const name = $("#name-input")[0].value;
    if(name === ""){
    }else{
      this.player.name = name;
      this.player.display.update(this.player);
      $("#initial-modal").toggleClass("show");
      $("#start").off("click", this.setName);
      $("input").blur();

      this.player.setDefaultStats(name);
      this.paused = false;
    }
  }

  tick(){
    const { player, stage, paused } = this;
    const enemies = this.getEnemies();
    if(player.hp > 0){
      const pos = player.pos;
      if(!paused){
        player.step();
        this.checkCollisions();
        objEach(enemies, (enemy) => { enemy.step(pos); });
      }
    }
  }

  addItem(item){
    this.items.push(item);
  }

  removeItem(item){
    const { items } = this;
    for (let i = 0; i < items.length; i++) {
      if(items[i].id === item.id){
        items.splice(i,1);
        i --;
      }
    }
  }

  pause(){
    this.paused = true;
  }

  unpause(){
    this.paused = false;
    this.player.invincible();
  }

  checkCollisions(){
    const { player, stage, items } = this;
    const enemies = this.getEnemies();

    this.itemCollision();
    this.stepCollision();
    this.doorCollision();
    objEach(enemies, (enemy) => {
      this.crabAttackCollision(enemy);
      this.attackCollision(enemy);
    });
  }

  doorCollision(){
    const { player, currentRoom, map, notMoved } = this;
    const doors = currentRoom.doors;
    if(notMoved){
      for (var i = 0; i < doors.length; i++) {
        if(isRectRectCollide(player.hitBox, doors[i])){
          this.getRoom(doors[i].id, doors[i].playerPos);
          this.notMoved = false;
          window.setTimeout(this.moveAgain, 1000);
          return;
        }
      }
    }

  }

  moveAgain(){
    this.notMoved = true;
  }

  stepCollision(){
    const { player, currentRoom, map } = this;
    if(currentRoom.id === this.map.exitRoomId){
      if(isRectRectCollide(player.hitBox, currentRoom.stepBox)){
        this.nextLevel();
      }
    }
  }

  crabAttackCollision(enemy){
    const { player, sounds } = this;

    if(!player.invic && isCircleRectCollide(enemy.hitBox, player.hitBox)){
      const vec = normalize(player.pos, enemy.pos);
      const body = player.takeDmg(enemy.att, vec);
      player.invincible();
      sounds.hit2.play();
      if(body){
        sounds.death.play();
        player.die(this.tokens);
      }
    }
  }

  itemCollision(){
    const { player, stage, items } = this;

    for (let i = 0; i < items.length; i++) {
      if(isCircleRectCollide(items[i].hitBox, player.hitBox)){
        items[i].pickUp(stage, player.inventory);
        items.splice(i, 1);
        i --;
      }
    }
  }

  attackCollision(enemy){
    const { player, sounds } = this;

    if(player.attacking && !player.attacked){
      if(isCircle2Collide(player.swingBox, enemy.hitBox)){
        const vec = normalize(enemy.pos, player.pos);
        const body = enemy.takeDmg(player.att, vec);
        sounds.hit.play();
        if(body && !player.attacked){
          sounds.crab_death.play();
          this.currentRoom.removeEnemy(enemy.name);
          player.gainExp(enemy.exp);
        }
        player.attacked = true;
      }
    }
  }

  setEnemies(){
    this.currentRoom.setEnemies(this.player.pos);
  }

  getEnemies(){
    return this.currentRoom.enemies;
  }

  nextLevel(){
    const game = this;
    const { stage } = this;
    const enemies = this.getEnemies();

    this.level += 1;
    this.paused = true;
    window.setTimeout(()=>{
      if($("#modal").css("opacity") === "0") {
        game.unpause();
      }
     }, 1000);
    this.removeRoom();
    this.newMap();
  }

  getRoom(id, pos){
    this.removeRoom();
    this.currentRoom = this.map.getRoom(id);
    this.updateRoom(pos);
  }

  newMap(){
    this.map = new Map({
      lvl: this.level,
      assets: this.assets,
      crabFuncs: this.crabFuncs()
    });
    this.currentRoom = sample(this.map.map);
    this.setEnemies();
    this.updateRoom();
  }

  binder(){
    this.removeBomb = this.removeBomb.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.crabAttackCollision = this.crabAttackCollision.bind(this);
    this.attackCollision = this.attackCollision.bind(this);
    this.setName = this.setName.bind(this);
    this.addItem = this.addItem.bind(this);
    this.addToken = this.addToken.bind(this);
    this.moveAgain = this.moveAgain.bind(this);
  }
}
