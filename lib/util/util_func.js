export function sumArr(arr1, arr2){
  const sum = [];
  for (let i = 0; i < arr1.length; i++) {
    sum[i] = arr1[i] + arr2[i];
  }
  return sum;
}

export function sample(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

export function getSkew(x, y, posX, posY){
  const yDiff = y - posY;
  const xDiff = x - posX;

  return (Math.atan2(yDiff, xDiff) * 180 / Math.PI) + 180;
}

export function objEach(obj, func){
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    func(obj[keys[i]]);
  }
}

export function normalize(p1, p2){
  const x = p1[0] - p2[0];
  const y = p1[1] - p2[1];
  const dist = Math.sqrt((x * x) + (y * y));
  if (dist !== 0){
    return [x / dist, y / dist];
  }
}

export function isCircleRectCollide(c1, r1){
    const distX = Math.abs(c1.x - r1.x - (r1.w / 2));
    const distY = Math.abs(c1.y - r1.y - (r1.h / 2));

    if (distX > ((r1.w / 2) + c1.r)) { return false; }
    if (distY > ((r1.h / 2) + c1.r)) { return false; }

    if (distX <= (r1.w / 2)) { return true; }
    if (distY <= (r1.h / 2)) { return true; }

    const dx=distX - r1.w / 2;
    const dy=distY - r1.h / 2;
    return ((dx * dx) + (dy * dy) <= (c1.r * c1.r));
}

export function isCircle2Collide(c1, c2){
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return (distance < (c1.r + c2.r));
}
