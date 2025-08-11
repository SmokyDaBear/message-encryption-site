const inputMessageBox = document.querySelector("#input-message");
const railsBox = document.querySelector("#num-rails");
const rotationsBox = document.querySelector("#num-rotations");
const keyBox = document.querySelector("#encryption-key");
const outputMessageBox = document.querySelector("#output-message");
const encodeBtn = document.querySelector("#encode-btn");
const decodeBtn = document.querySelector("#decode-btn");
let inputMessage;
let encryptionKey =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:' ,<.>";
let numRails = 3;
let numRotations = 13;
let outputMessage;

encodeBtn.addEventListener("click", () => {
  let message = inputMessage.value;
  console.log(message);
});

inputMessageBox.addEventListener("keyup", (e) => {
  inputMessage = e.target.value;
});

railsBox.addEventListener("keyup", (e) => {
  numRails = e.target.value;
});
rotationsBox.addEventListener("keyup", (e) => {
  numRotations = e.target.value;
});
keyBox.addEventListener("keyup", (e) => {
  encryptionKey = e.target.value;
});
const listKeys = (key, numRails, numRotations) => {
  return `<div class="flex-column align-start">
          <p>Key: ${key}</p>
          <p>Number of Rails: ${numRails}</p>
          <p>Number of Rotations: ${numRotations}</p>
        </div>`;
};

encodeBtn.addEventListener("click", () => {
  outputMessage = strongEncryption(
    inputMessage,
    numRails,
    encryptionKey,
    numRotations
  );
  outputMessage += listKeys(encryptionKey, numRails, numRotations);
  outputMessageBox.innerHTML = `<p>${outputMessage}</p>`;
});
decodeBtn.addEventListener("click", () => {
  outputMessage = strongDecryption(
    inputMessage,
    numRails,
    encryptionKey,
    numRotations
  );
  outputMessage += listKeys(encryptionKey, numRails, numRotations);
  outputMessageBox.innerHTML = `<p>${outputMessage}</p>`;
});
