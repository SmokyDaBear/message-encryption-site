// function rot13(message, key) {
//   const cipher = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
//     ""
//   );
//   const rotate = (char) => {
//     let isCap = false;
//     let newIndex;
//     if (char.match(/[A-Z]/)) {
//       isCap = true;
//       char = char.toLowerCase();
//     } else if (!char.match(/[a-z]/)) {
//       return char;
//     }
//     newIndex = cipher.indexOf(char) + key;
//     if (newIndex > 25) {
//       newIndex -= 26;
//     }
//     char = cipher[newIndex];
//     return isCap ? char.toUpperCase() : char;
//   };
//   const encode = (string) => {
//     return string
//       .split("")
//       .map((item) => rotate(item))
//       .join("");
//   };
//   return message
//     .split(" ")
//     .map((item) => encode(item))
//     .join(" ");
// }
// const secretMessage = "Jgnnq, ncwpej vjg pwmgu";
// const decode = (secretMessage) => {
//   for (let i = 0; i < 26; i++) {
//     console.log(i + rot13(secretMessage, i));
//   }
// };
// decode(secretMessage);
// decode(msg);
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

  let codex = getCodex(cipher, shift);
  const logger = {};
  let i = 0;
  for (let [key, value] of Object.entries(codex)) {
    logger[i] = { before: key, after: value };
    i++;
  }
  console.table(logger);

  return string
    .split("")
    .map((item) => (codex[item] ? codex[item] : item))
    .join("");
}
//railfence cipher
function encodeRailFenceCipher(string, numberRails, decodeMode = false) {
  // code
  const inputArr = string.split("");
  let answer = [];
  let railsLeft = +numberRails;
  //create the rails of the answer as a 2d array;
  while (railsLeft) {
    answer.push([]);
    railsLeft--;
  }
  let cur = 0;
  let goingDown = true;
  for (let i = 0; i < inputArr.length; i++) {
    answer[cur].push(inputArr[i]);
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
  // code
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
