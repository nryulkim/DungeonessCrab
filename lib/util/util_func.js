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
