// Elements
const inputMessageBox = document.getElementById("input-message");
const railsBox = document.getElementById("num-rails");
const rotationsBox = document.getElementById("num-rotations");
const keyBox = document.getElementById("encryption-key");
const outputMessageBox = document.getElementById("output-message");
const encodeBtn = document.getElementById("encode-btn");
const decodeBtn = document.getElementById("decode-btn");
const shareBtn = document.getElementById("share-btn");

const checkIfNumber = (value) => /^\d+$/.test(value);

const TNumberInputOptions = {
  defaultValue: typeof 0,
  min: typeof 0,
  max: typeof 0,
  for: typeof "any",
};

// Creates a number input with the requested options:
// documentId: the id of the container element to add the input to
// defaultValue: starting value
// min: minimum value
// max: maximum value
// Also adds increment and decrement buttons
const createNumberInput = ({
  documentId,
  min,
  max,
  initialValue,
  onUpdate,
}) => {
  // Get the container element
  const element = document.getElementById(documentId);
  // Add class for styling if it doesnt already exist
  element.classList.add("number-input-container");
  // The value variable to keep track of the current value
  let value = Number(initialValue);

  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.min = min;
  input.max = max;
  input.id = documentId + "-input";

  const validateAndUpdate = (e) => {
    let target = e.target;
    let newVal = target.value;
    if (newVal === "") {
      value = min;
      target.value = value;
      onUpdate(value);
    } else if (!checkIfNumber(value)) {
      target.value = value;
    } else if (Number(newVal) < min) {
      value = min;
      target.value = value;
      onUpdate(value);
    } else if (Number(newVal) > max) {
      value = max;
      target.value = value;
      onUpdate(value);
    } else {
      value = Number(newVal);
      target.value = value;
      onUpdate(value);
    }
  };
  input.addEventListener("change", validateAndUpdate);
  input.addEventListener("keyup", validateAndUpdate);
  input.addEventListener("blur", validateAndUpdate);

  const increment = (e) => {
    value = Math.min(value + 1, max);
    input.value = value;
    onUpdate(value);
  };
  const decrement = (e) => {
    value = Math.max(value - 1, min);
    input.value = value;
    onUpdate(value);
  };
  const addButton = document.createElement("button");
  addButton.innerText = "+";
  addButton.classList.add("increment-button");
  addButton.ariaFor = "decrement-button";
  addButton.addEventListener("click", increment);

  const subButton = document.createElement("button");
  subButton.innerText = "-";
  subButton.classList.add("decrement-button");
  subButton.ariaFor = "increment-button";
  subButton.addEventListener("click", decrement);

  element.appendChild(subButton);
  element.appendChild(input);
  element.appendChild(addButton);

  return input;
};
// Toaster for notifications

class Toaster {
  constructor(toastId = "toaster", toastMessageId = "toast-message") {
    this.toaster = document.getElementById(toastId);
    this.toastMessage = document.getElementById(toastMessageId);
    this.queue = [];
    this.isProcessing = false;
  }

  async showToast(message, duration = 3000) {
    return new Promise((resolve) => {
      this.queue.push({ message, duration, resolve });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const { message, duration, resolve } = this.queue.shift();

    this.toastMessage.textContent = message;
    this.toaster.classList.remove("hidden");
    this.toaster.classList.add("activate");

    // Start fade out before duration ends
    setTimeout(() => {
      this.toaster.classList.add("deactivate");
    }, duration - 500);

    // Complete the animation and clean up
    setTimeout(() => {
      this.toaster.classList.remove("activate", "deactivate");
      this.toaster.classList.add("hidden");
      this.isProcessing = false;
      resolve();

      // Process next item in queue
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }, duration);
  }

  showError(message, duration = 5000) {
    return this.showToast(`⚠️ Error: ${message}`, duration);
  }
}
const toaster = new Toaster();

// Variables
let inputMessage;
let encryptionKey;
let numRails = 3;
let numRotations = 13;
let outputMessage;
let encryptionMode = "encrypt";
let currentCipherText = "";
const altKey =
  "AbaBcCdDEeFfgGHhiIJjkKlLmMnN!@321#4$5%6^7&8*9(0)oOpPqQRrsStTuUvVwWxXyYzZ,<.>?/`~";
let decodeUrl = false;

// Get URL parameters and hydrate inputs
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlMode = urlParams.get("mode");
  if (urlMode === "encrypt" || urlMode === "decrypt") {
    encryptionMode = urlMode;
  }
  const urlMessage = urlParams.get("message");
  if (urlMessage) {
    inputMessageBox.value = decodeURIComponent(urlMessage);
    inputMessage = inputMessageBox.value;
  }
  const urlRails = urlParams.get("rails");
  if (urlRails) {
    railsBox.value = urlRails;
    numRails = Number(urlRails);
  }
  const urlRotations = urlParams.get("rotations");
  if (urlRotations) {
    rotationsBox.value = urlRotations;
    numRotations = Number(urlRotations);
  }
  const urlKey = urlParams.get("key");
  if (urlKey) {
    keyBox.value = decodeURIComponent(urlKey);
    encryptionKey = keyBox.value;
  }
  if (encryptionMode === "decrypt") {
    decodeUrl = true;
  }
};

const createUrlParams = () => {
  const urlParams = new URLSearchParams();
  urlParams.set("mode", encryptionMode);
  urlParams.set("message", encodeURIComponent(inputMessageBox.value));
  urlParams.set("rails", railsBox.value);
  urlParams.set("rotations", rotationsBox.value);
  urlParams.set("key", encodeURIComponent(keyBox.value));
  const newUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    urlParams.toString();
  window.history.replaceState({ path: newUrl }, "", newUrl);
};

const createSharableLink = () => {
  const urlParams = new URLSearchParams();
  urlParams.set("mode", "decrypt");
  urlParams.set("message", encodeURIComponent(currentCipherText));
  urlParams.set("rails", numRails);
  urlParams.set("rotations", numRotations);
  urlParams.set("key", encodeURIComponent(encryptionKey));
  const newUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    urlParams.toString();
  return newUrl;
};

const initControls = () => {
  const numRailsInitial = railsBox.value || numRails;
  const numRotationsInitial = rotationsBox.value || numRotations;

  createNumberInput({
    documentId: "num-rails",
    min: 2,
    max: 12,
    initialValue: numRailsInitial,
    onUpdate: (value) => {
      railsBox.value = value;
      updateOutput(encryptionMode);
    },
  });

  createNumberInput({
    documentId: "num-rotations",
    min: 1,
    max: 24,
    initialValue: numRotationsInitial,
    onUpdate: (value) => {
      rotationsBox.value = value;
      updateOutput(encryptionMode);
    },
  });
};
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
    toaster.showToast(
      "Error: invalid encryption mode, select either 'encrypt' or 'decrypt'"
    );
  }
  currentCipherText = outputMessage;

  const decoratedOutput = `${currentCipherText}${listKeys(
    encryptionKey,
    numRails,
    numRotations
  )}`;

  outputMessageBox.innerHTML = `<p>${decoratedOutput}</p>`;
  createUrlParams();
}

const registerListeners = () => {
  // Listeners for input message
  inputMessageBox.addEventListener("keyup", () => {
    updateOutput(encryptionMode);
  });
  inputMessageBox.addEventListener("click", () => updateOutput(encryptionMode));

  // Listener for key input
  keyBox.addEventListener("keyup", () => updateOutput(encryptionMode));

  encodeBtn.addEventListener("click", () => {
    encryptionMode = "encrypt";
    updateOutput(encryptionMode);
  });

  decodeBtn.addEventListener("click", () => {
    encryptionMode = "decrypt";
    updateOutput(encryptionMode);
  });

  shareBtn.addEventListener("click", () => {
    const sharableLink = createSharableLink();
    navigator.clipboard.writeText(sharableLink).then(
      () => {
        toaster.showToast("Shareable link copied to clipboard!");
      },
      (err) => {
        toaster.showError("Failed to copy link: " + err);
      }
    );
  });
};

const init = () => {
  getUrlParams();
  initControls();

  // Welcome the user after controls are in place
  toaster.showToast("Welcome to the Message Encrypter!", 4000);
  toaster.showToast(
    "Use the share button to create a link to your encrypted message!",
    5000,
    true
  );

  if (decodeUrl) {
    encryptionMode = "decrypt";
  }

  registerListeners();
  updateOutput(encryptionMode);
};

window.addEventListener("load", init);
