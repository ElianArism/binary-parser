import { PHRASES } from "./constants.js";

const parseForm = document.querySelector("#parse-form");
const submitButton = document.querySelector("#submit-button");
const parsedMessageDiv = document.querySelector("#parsed-message");
const messageInputLabel = document.querySelector("#message-input");

const convertTextareaInput = document.querySelector("#convert-input");
const radioBinary = document.querySelector("#input-type-binary");
const radioText = document.querySelector("#input-type-text");

let validationsPassedCounter = 0;
submitButton.disabled = true;

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateAnimatedLi = (words, delay = null) => {
  const li = document.createElement("li");
  const animationDelay = delay ?? getRandomValue(3, 15);

  li.setAttribute(
    "style",
    `left: ${getRandomValue(1, 100)}%; 
      animation-delay: ${animationDelay}s;   
      animation-duration: ${getRandomValue(10, 20)}s;`
  );

  for (let i = 0; i < words.length; i++) {
    const char = words[i];

    const span = document.createElement("span");
    span.textContent = char;

    li.appendChild(span);
  }

  return li;
};

const validateForm = (e) => {
  const val = e.target.value.trim();

  messageInputLabel.textContent = val === "binary" ? "Put your binary code here!" : "Put your message here!";

  if (val?.length) {
    if (validationsPassedCounter < 2) validationsPassedCounter++;
  } else {
    if (validationsPassedCounter > 0) validationsPassedCounter--;
  }

  submitButton.disabled = validationsPassedCounter !== 2;
};

const parseMessage = (message, conversionMethod) => {
  if (conversionMethod === "binary") {
    let parsedMessage = "";
    for (let i = 0; i < message.length; i++) {
      const unicode = message.charCodeAt(i);
      let parsedChar = unicode.toString("2");

      if (parsedChar.length < 8) {
        parsedChar = parsedChar.padStart(8, "0");
      }

      parsedMessage += parsedChar + " ";
    }
    return parsedMessage;
  } else {
    const binaryString = message.trim().split(" ").join("");
    const binaryArr = [];
    let binaryArrElementSize = 8;
    let currentBinaryArrIndex = 0;

    for (let i = 0; i < binaryString.length; i++) {
      binaryArr[currentBinaryArrIndex] = binaryArr[currentBinaryArrIndex] ?? "";
      binaryArr[currentBinaryArrIndex] += binaryString[i];
      binaryArrElementSize--;

      if (binaryArrElementSize === 0) {
        binaryArrElementSize = 8;
        currentBinaryArrIndex++;
      }
    }

    const uintArray = new Uint8Array(binaryArr.map((el) => parseInt(el, 2)));
    const parsedMessage = Array.from(uintArray, (el) => String.fromCharCode(el)).join("");

    return parsedMessage;
  }
};

radioBinary.addEventListener("change", validateForm);
radioText.addEventListener("change", validateForm);
convertTextareaInput.addEventListener("input", validateForm);

parseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(parseForm);
  const formValue = Object.fromEntries(formData.entries());
  if (!formValue["message-input"] || !formValue["input-type"]) return;

  const parsedMessage = parseMessage(formValue["message-input"], formValue["input-type"]);
  parsedMessageDiv.textContent = parsedMessage;
});

document.addEventListener("DOMContentLoaded", () => {
  const wordListContainer = document.querySelector(".word-list");

  let phrases = [];

  if (window.innerWidth < 480) {
    // for smarthphones
    phrases = PHRASES.slice(0, 30);
  } else if (window.innerWidth < 1024) {
    phrases = PHRASES.slice(0, 70);
  } else {
    phrases = PHRASES;
  }

  phrases.forEach((words) => {
    const rdm = getRandomValue(-1, 2);
    const li = generateAnimatedLi(words, rdm);
    wordListContainer.appendChild(li);
  });

  phrases.forEach((words) => {
    const li = generateAnimatedLi(words);
    wordListContainer.appendChild(li);
  });
});
