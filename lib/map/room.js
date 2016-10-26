import Enemy from '../chars/enemy';


export default class Room{
  constructor(pos, lvl){
    this.lvl = lvl;
    this.pos = pos;
  }

  getEnemies(pos){
    this.enemies = this.enemies || this.createEnemies(pos);
    return this.enemies;
  }

  createEnemies(pos){
    const lvl = this.level;
    for (let i = 0; i < lvl; i++) {
      const crabPos = this.getPos(pos);
      const enemy = new Enemy({
        name: "Crab" + i,
        stage: this.stage,
        hp: lvl*1.5,
        lvl: lvl,
        att: lvl*2 - 1,
        def: lvl*2 - 1,
        exp: lvl/2,
        spd: lvl/8,
        pos: crabPos,
        crab: this.assets.generateCrab(),
        newBag: this.assets.newBag,
        addItem: this.addItem,
        removeItem: this.removeItem,
        addToken: this.addToken.bind(this)
      });
      this.enemies[enemy.name] = enemy;
    }
  }

  getPos(pos){
    let r1 = Math.floor(Math.random() * 390) + 60,
        r2 = Math.floor(Math.random() * 390) + 60;
    while(distance(pos, [r1,r2]) < 60){
      r1 = Math.floor(Math.random() * 390) + 60;
      r2 = Math.floor(Math.random() * 390) + 60;
    }
    return [r1,r2];
  }

}
