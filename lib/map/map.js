import { randomNum, sumArr, sample } from '../util/util_func';
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
    this.map = this.randomRooms();
    const randomRoom = sample(this.map);
    this.exitRoomId = randomRoom.id;
    randomRoom.setSteps();
  }

  neighbors(rooms, pos){
    const room = pos;
    let neighbors = [];
    for (let i = 0; i < NEIGHBOR_DIRS.length; i++){
      const neighbor = sumArr(NEIGHBOR_DIRS[i], room);
      if(this.hasPos(rooms, neighbor)){
        neighbors.push(neighbor);
      }
    }
    return neighbors;
  }

  randomRooms(){
    let i = 0;
    const half = Math.floor(this.numRooms/2);
    const rooms = [];
    while(i < this.numRooms){
      let pos = [randomNum(0, this.numRooms), randomNum(0, this.numRooms)];
      if(i === 0) { pos = [half, half]; }
      const neighbors = this.neighbors(rooms, pos);
      if(!this.hasPos(rooms, pos) && neighbors.length === 0){
        const room = new Room({
          pos: pos,
          lvl: this.lvl,
          assets: this.assets,
          crabFuncs: this.crabFuncs,
          neighbors: neighbors
        });

        rooms.push(room);
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
