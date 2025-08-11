class Logger {
  constructor(start) {
    this.currentIndex = start;
    this.logs = {};
  }
  printTable() {
    console.table(this.logs);
  }
  log(i, string) {
    this.log[i] = string;
  }
  printEach() {
    let logs = this.logs;
    console.log(`\n Logs:`);
    for (let [key, value] of Object.entries(logs)) {
      console.log(key, value);
    }
  }
}

//Big Oof, spent too long on this lol
const swap = (i, j, arr) => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return parseInt(arr.join(""));
};

function getBigger(n, highestSoFar, i, arr) {
  let mem, test;
  if (!arr) {
    arr = highestSoFar.toString().split("");
  }

  let nextHighest = highestSoFar;
  for (let i = arr.length - 1; i >= 0; i--) {
    for (let j = arr.length - 1; j >= 0; j--) {
      if (arr[i] != arr[j]) {
        mem = arr.slice();
        test = swap(i, j, mem);
        if (test > n) {
          nextHighest = Math.min(nextHighest, test);
        }
      }
    }
  }
  i = i > 0 ? i - 1 : 0;
  return i == 0 ? highestSoFar : getBigger(n, nextHighest, i);
}

function nextBigger(n) {
  const digits = n.toString().split("");

  let nextHighest = digits.slice();
  nextHighest = parseInt(nextHighest.sort((a, b) => b - a).join(""));
  if (n == nextHighest) {
    return -1;
  }
  let i = digits.length;
  nextHighest = getBigger(n, nextHighest, i, digits);

  //
  console.log(`Input: ${n} Output: ${nextHighest}`);
  return nextHighest;
}
