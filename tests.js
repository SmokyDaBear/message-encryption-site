const {
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
} = require("./scripts/encoder.js");

const alphaKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const digitKey = "0123456789";

let total = 0;
let failed = 0;

const assertEqual = (label, actual, expected, details = "") => {
  total++;
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (!pass) {
    const detailText = details ? `\n  context: ${details}` : "";
    console.error(
      `${label} failed:\n  expected: ${JSON.stringify(
        expected
      )}\n  actual:   ${JSON.stringify(actual)}${detailText}`
    );
    failed++;
  } else {
    console.log(`PASS: ${label}`);
  }
};

const removeDupesTests = {
  string1: {
    input: "aaaaabbbbbbbbxxxxdddddddd",
    expected: "abxd",
  },
  string2: {
    input: "bbbbccccddddeeeebbbbcccddedebccb",
    expected: "bcde",
  },
  stringWithSymbols: {
    input: '!!!!!!@@@@@@#####$$$$$$%%%%%%^^^^^&*()_+{}|:"<>?aaaaa',
    expected: '!@#$%^&*()_+{}|:"<>?a',
  },
  numbers: {
    input: "1111222233334444",
    expected: "1234",
  },
  array1: {
    input: ["a", "b", "b", "c", "c", "c", "d", "d", "d", "e", "e", "e"],
    expected: ["a", "b", "c", "d", "e"],
  },
  array2: {
    input: ["x", "x", "y", "y", "z", "z", "z", "w", "w", "v", "v", "v"],
    expected: ["x", "y", "z", "w", "v"],
  },
};

for (let key in removeDupesTests) {
  let t = removeDupesTests[key];
  let result = removeDupesFromKey(t.input);
  assertEqual(
    `removeDupesTests.${key}`,
    result,
    t.expected,
    `input: ${t.input}`
  );
}

const validateKeyWithCipherTests = {
  test1: {
    key: "abcde",
    cipher: "xyz",
    expected: false,
  },
  test2: {
    key: "absolutely",
    cipher: "absolutely",
    expected: true,
  },
  test3: {
    key: "abcxyz",
    cipher: "xyzabc",
    expected: true,
  },
};

for (let key in validateKeyWithCipherTests) {
  let t = validateKeyWithCipherTests[key];
  let result = validateKeyWithCipher(t.key, t.cipher);
  assertEqual(
    `validateKeyWithCipherTests.${key}`,
    result,
    t.expected,
    `key: ${t.key}, cipher: ${t.cipher}`
  );
}

const encryptionTests = {
  test1: {
    input: "Hello, World!",
    key: alphaKey,
    shift: 2,
    expected: "Jgnnq, Yqtnf!",
  },
  test2: {
    input: "Attack at Dawn!",
    key: alphaKey,
    shift: 5,
    expected: "Fyyfhp fy IfBs!",
  },
  test3: {
    input: "1234567890",
    key: digitKey,
    shift: 3,
    expected: "4567890123",
  },
};
for (let test in encryptionTests) {
  let t = encryptionTests[test];
  const encoded = encode(t.input, t.shift, t.key);
  assertEqual(
    `encryptionTests.${test}.encode`,
    encoded,
    t.expected,
    `input: ${t.input}, shift: ${t.shift}, key: ${t.key}`
  );

  const decoded = encode(encoded, -t.shift, t.key);
  assertEqual(
    `encryptionTests.${test}.decode`,
    decoded,
    t.input,
    `roundtrip of encoded text with inverse shift`
  );
}

const rotTests = {
  testKeyTooShort: {
    input: "abcdefghijklmnop",
    key: "abcdefghijklmnopqrstuvwxyz",
    shift: 2,
    expected: "cdefghijklmnopqr",
  },
  testMissingKey: {
    input: "abcdefghijklmnop",
    key: "abcdefghijklmnopqrstuvwxyz",
    shift: 2,
    expected: "cdefghijklmnopqr",
  },
};

for (let test in rotTests) {
  let t = rotTests[test];
  const encoded = encode(t.input, t.shift, t.key);
  assertEqual(
    `rotTests.${test}.encode`,
    encoded,
    t.expected,
    `input: ${t.input}, shift: ${t.shift}, key: ${t.key || "(empty)"}`
  );

  const decoded = encode(encoded, -t.shift, t.key);
  assertEqual(
    `rotTests.${test}.decode`,
    decoded,
    t.input,
    `roundtrip of encoded text with inverse shift`
  );
}

const railFenceTests = {
  testNumbers: { input: "1234567890", rails: 3, expected: "1592468037" },
  testLetters: {
    input: "abcdefghijklmno",
    rails: 3,
    expected: "aeimbdfhjlncgko",
  },
};

for (const test in railFenceTests) {
  const t = railFenceTests[test];
  const result = encodeRailFenceCipher(t.input, t.rails);
  assertEqual(
    `railFenceTests.${test}.encode`,
    result,
    t.expected,
    `input: ${t.input}, rails: ${t.rails}`
  );

  const decoded = decodeRailFenceCipher(result, t.rails);
  assertEqual(
    `railFenceTests.${test}.decode`,
    decoded,
    t.input,
    `roundtrip rail fence`
  );
}

const strongRoundTrip = {
  input: "Encrypt this message across rails",
  rails: 4,
  key: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:' ,<.>",
  rot: 15,
};

const encryptedStrong = strongEncryption(
  strongRoundTrip.input,
  strongRoundTrip.rails,
  strongRoundTrip.key,
  strongRoundTrip.rot
);
const decryptedStrong = strongDecryption(
  encryptedStrong,
  strongRoundTrip.rails,
  strongRoundTrip.key,
  strongRoundTrip.rot
);
assertEqual(
  "strongRoundTrip",
  decryptedStrong,
  strongRoundTrip.input,
  "strongEncryption/strongDecryption roundtrip"
);

if (failed > 0) {
  console.error(
    `\nTest run complete: ${total - failed} passed, ${failed} failed`
  );
  process.exitCode = 1;
} else {
  console.log(`\nAll tests passed (${total} assertions).`);
}
