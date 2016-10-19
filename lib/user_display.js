export default class UserDisplay{
  constructor(char){
    this.update(char);
  }

  update(char){
    const { name, lvl, hp, att, def, color, spd } = char;
    this.name = name;
    this.lvl = lvl;
    this.hp = hp;
    this.att = att;
    this.def = def;
    this.spd = spd;
    this.color = color;

    this.render();
  }

  render(){
    $('#name').text(this.name);
    $('#lvl').text(this.lvl);
    $('#hp').text(this.hp);
    $('#att').text(this.att);
    $('#def').text(this.def);
    $('#spd').text(this.spd);
  }
}
