const translate = (cipher, i, shift) => {
  const keyLength = cipher.length - 1;
  let replacement = i + shift;
  if (replacement <= keyLength && replacement >= 0) {
    replacement = cipher[replacement];
  } else if (replacement < 0) {
    replacement = cipher[replacement + keyLength + 1];
  } else {
    replacement = cipher[replacement - keyLength - 1];
  }
  return replacement;
};
const getCodex = (arr, shift) => {
  let codex = {};
  for (let [i, item] of arr.entries()) {
    codex[item] = translate(arr, i, shift);
  }
  return codex;
};
//rot13 scrambler
function encode(
  string,
  shift = 13,
  key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:' ,<.>"
) {
  let cipher = key.split("");

  let codex = getCodex(cipher, parseInt(shift));

  return string
    .split("")
    .map((item) => (codex[item] ? codex[item] : item))
    .join("");
}
//railfence cipher
function encodeRailFenceCipher(string, numberRails, decodeMode = false) {
  const inputArr = string.split("");
  let answer = [];
  let railsLeft = +numberRails;
  while (railsLeft) {
    answer.push([]);
    railsLeft--;
  }
  let cur = 0;
  let goingDown = true;
  for (let item of inputArr) {
    answer[cur].push(item);
    if (goingDown) {
      cur++;
      if (cur >= numberRails - 1) {
        goingDown = false;
      }
    } else {
      cur--;
      if (cur <= 0) {
        goingDown = true;
      }
    }
  }
  return decodeMode ? answer.map((row) => row.length) : answer.flat().join("");
}

function decodeRailFenceCipher(string, numberRails) {
  let rowLengths = encodeRailFenceCipher(string, numberRails, true);
  let splitString = [];
  let lastChar = 0;
  let answer = "";

  for (let numChars of rowLengths) {
    splitString.push(string.substring(lastChar, numChars + lastChar));
    lastChar += numChars;
  }
  let cur = 0;
  let goingDown = true;
  while (answer.length < string.length) {
    let curLetter = splitString[cur].charAt(0);
    answer += curLetter;
    splitString[cur] = splitString[cur].slice(1);
    if (goingDown) {
      cur++;
      if (cur >= numberRails - 1) {
        goingDown = false;
      }
    } else {
      cur--;
      if (cur <= 0) {
        goingDown = true;
      }
    }
  }
  return answer;
}

const strongEncryption = function (
  inputMessage,
  numRails = 4,
  encryptionKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:' ,<.>",
  encryptRot = 15
) {
  let message = inputMessage.slice();
  message = encode(message, encryptRot, encryptionKey);
  message = encodeRailFenceCipher(message, numRails);
  return message;
};

const strongDecryption = function (
  encryptedMessage,
  numRails = 4,
  encryptionKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:' ,<.>",
  encryptRot = 15
) {
  let answer = encryptedMessage.slice();
  answer = encode(answer, -encryptRot, encryptionKey);
  answer = decodeRailFenceCipher(answer, numRails);
  return answer;
};
