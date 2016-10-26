import { randomNum, sumArr } from '../util/util_func';
import { NEIGHBOR_DIRS } from '../util/constants';
import Room from './room';

export default class Map {
  constructor(options){
    this.assets = options.assets;
    this.crabFuncs = options.crabFuncs;
    this.lvl = options.lvl;
    this.numRooms = this.lvl;
    this.genMap();
  }

  genMap(){
    const rooms = this.randomRooms();
    this.map = [];
    for (let i = 0; i < rooms.length; i++) {
      this.map.push(new Room({
        pos: rooms[i],
        lvl: this.lvl,
        assets: this.assets,
        crabFuncs: this.crabFuncs
      }));
    }
  }

  hasNeighbor(rooms, pos){
    const room = pos;

    for (let i = 0; i < NEIGHBOR_DIRS.length; i++){
      const neighbor = sumArr(NEIGHBOR_DIRS[i], room);
      if(this.hasPos(rooms, neighbor)){
        return true;
      }
    }
    return false;
  }

  randomRooms(){
    let i = 0;
    const half = Math.floor(this.numRooms/2);
    const rooms = [[half, half]];
    while(i < this.numRooms){
      const pos = [randomNum(0, this.numRooms), randomNum(0, this.numRooms)];
      if(!this.hasPos(rooms, pos) && this.hasNeighbor(rooms, pos)){
        rooms.push(pos);
        i ++;
      }
    }
    return rooms;
  }

  hasPos(rooms, pos){
    for (let i = 0; i < rooms.length; i++) {
      if(rooms[i][0] === pos[0] && rooms[i][1] === pos[1]){
        return true;
      }
    }

    return false;
  }
}
