function removeDupesFromKey(inputKey) {
  const keyIsString = typeof inputKey === "string";
  const keyIsArray = Array.isArray(inputKey);
  let shallowCopy;
  if (!inputKey) {
    return "";
  }
  if (!keyIsString && !keyIsArray) {
    console.error("Invalid key type, must be string or array");
    return "";
  }
  if (keyIsString) {
    shallowCopy = new Set(inputKey.split(""));
    return Array.from(shallowCopy).join("");
  }
  if (keyIsArray) {
    shallowCopy = new Set(inputKey);
    return Array.from(shallowCopy);
  }
}

const validateKeyWithCipher = (key, cipher) => {
  let valid = true;
  for (let char of key) {
    if (!cipher.includes(char)) {
      valid = false;
      console.log(`Invalid character in key: ${char}`);
    }
  }
  return valid;
};

const validateShift = (shift, cipher) => {
  if (isNaN(shift) || !Number.isInteger(Number(shift))) {
    console.error("Shift must be an integer");
    return false;
  }
  if (Math.abs(shift) >= cipher.length) {
    console.error("Shift must be less than the length of the cipher");
    return false;
  }
  return true;
};

const overrideCipherWithKey = (key, defaultCipher) => {
  const cipherIsString = typeof defaultCipher === "string";
  const cipherIsArray = Array.isArray(defaultCipher);
  if (!cipherIsString && !cipherIsArray) {
    throw new Error("Invalid cipher type, must be string or array");
  }

  if (cipherIsString) {
    let newCipher = key + defaultCipher;
    newCipher = removeDupesFromKey(newCipher);
    return newCipher;
  }
  if (cipherIsArray) {
    let newCipher = key.concat(defaultCipher, key);
    newCipher = removeDupesFromKey(newCipher);
    return newCipher;
  }
};

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
  arr = removeDupesFromKey(arr);
  let codex = {};
  let i = 0;
  for (let item of arr) {
    codex[item] = translate(arr, i, shift);
    i++;
  }
  return codex;
};
//rot13 scrambler
function encode(
  string,
  shift = 13,
  key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:' ,<.>"
) {
  let cipher = removeDupesFromKey(key).split("");

  let isValidCipher = true;
  try {
    isValidCipher = validateKeyWithCipher(key, cipher);
  } catch (e) {
    console.log(e.message);
    isValidCipher = false;
  }

  let isValidShift = validateShift(shift, cipher);
  if (!isValidCipher) {
    cipher = overrideCipherWithKey("", cipher);
  }

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
  // Decrypt in reverse order of encryption: rail fence first, then reverse rotation
  let answer = encryptedMessage.slice();
  answer = decodeRailFenceCipher(answer, numRails);
  answer = encode(answer, -encryptRot, encryptionKey);
  return answer;
};

// Provide exports for Node/CommonJS while keeping browser globals available
const encoderExports = {
  removeDupesFromKey,
  validateKeyWithCipher,
  validateShift,
  overrideCipherWithKey,
  translate,
  getCodex,
  encode,
  encodeRailFenceCipher,
  decodeRailFenceCipher,
  strongEncryption,
  strongDecryption,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = encoderExports;
}

if (typeof window !== "undefined") {
  window.encoder = encoderExports;
}
