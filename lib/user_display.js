export default class UserDisplay{
  constructor(char){
    this.update(char);
  }

  update(char){
    const { name, lvl, hp, att, def, color, spd, exp, expToLevel, attr, maxHp } = char;
    this.name = name;
    this.lvl = lvl;
    this.hp = hp < 0 ? 0 : Math.floor(10 * hp) / 10;
    this.maxHp = maxHp;
    this.att = att;
    this.def = def;
    this.spd = spd;
    this.color = color;
    this.exp = exp;
    this.attr = attr;
    this.expToLevel = expToLevel;
    this.render();
  }

  render(){
    $('.name').text(this.name);
    $('.lvl').text(this.lvl);
    $('.hp').text(this.hp + "/" + this.maxHp);
    $('.att').text(this.att);
    $('.def').text(this.def);
    $('.spd').text(this.spd);
    $('.exp').text(this.exp + "/" + this.expToLevel);
    $('#attr').text(this.attr);
  }
}
