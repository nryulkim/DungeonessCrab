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

  getRoom(id){
    for (let i = 0; i < this.map.length; i++) {
      if(this.map[i].id === id){
        return this.map[i];
      }
    }
  }

  genMap(){
    this.map = this.randomRooms();

    for (let i = 0; i < this.map.length; i++) {
      this.map[i].neighbors = this.getNeighbors(this.map[i]);
    }
    for (let i = 0; i < this.map.length; i++) {
      this.map[i].setDoors();
    }

    const randomRoom = sample(this.map);
    this.exitRoomId = randomRoom.id;
    randomRoom.setSteps();
  }

  getNeighbors(room){
    const neighbors = [];
    const rooms = this.map;
    for (let i = 0; i < NEIGHBOR_DIRS.length; i++){
      const nextPos = sumArr(NEIGHBOR_DIRS[i], room.pos);
      const neighbor = this.getRoomByPos(nextPos);
      if(neighbor){
        neighbors.push(neighbor);
      }
    }
    return neighbors;
  }

  neighbors(rooms, pos){
    let neighbors = [];
    for (let i = 0; i < NEIGHBOR_DIRS.length; i++){
      const nextPos = sumArr(NEIGHBOR_DIRS[i], pos);
      if(this.hasPos(rooms, nextPos)){
        return true;
      }
    }
    return false;
  }

  randomRooms(){
    let i = 0;
    const half = Math.floor(this.numRooms/2);
    const rooms = [];
    while(i < this.numRooms){
      let pos = [randomNum(0, this.numRooms), randomNum(0, this.numRooms)];
      if(i === 0) {
        rooms.push(new Room({
          pos: [half, half],
          lvl: this.lvl,
          assets: this.assets,
          crabFuncs: this.crabFuncs
        }));
        i ++;
      }
      if(!this.hasPos(rooms, pos) && this.neighbors(rooms, pos)){
        const room = new Room({
          pos: pos,
          lvl: this.lvl,
          assets: this.assets,
          crabFuncs: this.crabFuncs,
        });

        rooms.push(room);
        i ++;
      }
    }
    return rooms;
  }

  getRoomByPos(pos){
    const rooms = this.map;
    for (let i = 0; i < rooms.length; i++) {
      if(rooms[i].pos[0] === pos[0] && rooms[i].pos[1] === pos[1]){
        return rooms[i];
      }
    }
  }

  hasPos(rooms, pos){
    for (let i = 0; i < rooms.length; i++) {
      if(rooms[i].pos[0] === pos[0] && rooms[i].pos[1] === pos[1]){
        return true;
      }
    }

    return false;
  }
}
