const inputMessageBox = document.getElementById("input-message");
const railsBox = document.getElementById("num-rails");
const rotationsBox = document.getElementById("num-rotations");
const keyBox = document.getElementById("encryption-key");
const outputMessageBox = document.getElementById("output-message");
const encodeBtn = document.getElementById("encode-btn");
const decodeBtn = document.getElementById("decode-btn");
let inputMessage;
let encryptionKey;
let numRails = 3;
let numRotations = 13;
let outputMessage;
let encryptionMode = "encrypt";
const altKey =
  "AbaBcCdDEeFfgGHhiIJjkKlLmMnN!@321#4$5%6^7&8*9(0)oOpPqQRrsStTuUvVwWxXyYzZ,<.>?/`~";

inputMessageBox.addEventListener("keyup", (e) => {
  updateOutput(encryptionMode);
});
inputMessageBox.addEventListener("click", (e) => updateOutput(encryptionMode));

railsBox.addEventListener("keyup", (e) => updateOutput(encryptionMode));
railsBox.addEventListener("click", (e) => updateOutput(encryptionMode));
rotationsBox.addEventListener("keyup", (e) => updateOutput(encryptionMode));
rotationsBox.addEventListener("click", (e) => updateOutput(encryptionMode));
keyBox.addEventListener("keyup", (e) => updateOutput(encryptionMode));
const listKeys = (key, numRails, numRotations) => {
  return `<div class="flex-column align-start">
          <p>Key: ${key}</p>
          <p>Number of Rails: ${numRails}</p>
          <p>Number of Rotations: ${numRotations}</p>
        </div>`;
};

function updateOutput(encryptionMode) {
  inputMessage = inputMessageBox.value;
  numRails = railsBox.value;
  if (!numRails) {
    numRails = 3;
  }
  encryptionKey = keyBox.value;
  if (!encryptionKey) {
    encryptionKey =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:' ,.>";
  }
  numRotations = rotationsBox.value;
  if (!numRotations) {
    numRotations = 13;
  }

  if (encryptionMode == "encrypt") {
    outputMessage = strongEncryption(
      inputMessage,
      numRails,
      encryptionKey,
      numRotations
    );
  } else if (encryptionMode == "decrypt") {
    outputMessage = strongDecryption(
      inputMessage,
      numRails,
      encryptionKey,
      numRotations
    );
  } else {
    alert("invalid encryption mode, select either 'encrypt' or 'decrypt'");
  }
  outputMessage += listKeys(encryptionKey, numRails, numRotations);
  outputMessageBox.innerHTML = `<p>${outputMessage}</p>`;
}

encodeBtn.addEventListener("click", () => {
  encryptionMode = "encrypt";
  updateOutput(encryptionMode);
});
decodeBtn.addEventListener("click", () => {
  encryptionMode = "decrypt";
  updateOutput(encryptionMode);
});
