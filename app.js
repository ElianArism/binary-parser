import { PHRASES } from "./constants.js";

const parseForm = document.querySelector("#parse-form");
const submitButton = document.querySelector("#submit-button");
const parsedMessageDiv = document.querySelector("#parsed-message");

const convertTextareaInput = document.querySelector("#convert-input");
const radioBinary = document.querySelector("#input-type-binary");
const radioText = document.querySelector("#input-type-text");

let validationsPassedCounter = 0;
submitButton.disabled = true;

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const validateForm = (e) => {
  const val = e.target.value.trim();

  if (val?.length) {
    if (validationsPassedCounter < 2) validationsPassedCounter++;
  } else {
    if (validationsPassedCounter > 0) validationsPassedCounter--;
  }
  console.log(validationsPassedCounter);
  submitButton.disabled = validationsPassedCounter !== 2;
};

const parseMessage = (message, conversionMethod) => {
  if (conversionMethod === "binary") {
    let parsedMessage = "";
    for (let i = 0; i < message.length; i++) {
      const unicode = message.charCodeAt(i);
      let parsedChar = unicode.toString("2");
      console.log(parsedChar);
      console.log(parsedChar.length);
      if (parsedChar.length < 8) {
        parsedChar = parsedChar.padStart(8, "0");
      }
      console.log("parsed: " + parsedChar);
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

  PHRASES.forEach((words) => {
    const li = document.createElement("li");
    li.setAttribute(
      "style",
      `left: ${getRandomValue(1, 100)}%; animation-delay: ${getRandomValue(
        3,
        15
      )}s;   animation-duration: ${getRandomValue(10, 20)}s;`
    );

    for (let i = 0; i < words.length; i++) {
      const char = words[i];

      const span = document.createElement("span");
      span.textContent = char;

      li.appendChild(span);
    }

    wordListContainer.appendChild(li);
  });
});
