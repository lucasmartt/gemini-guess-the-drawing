import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-pro-vision"; // "gemini-1.5-pro-latest"
const API_KEY = `${import.meta.env.VITE_API_KEY}`;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const OUTPUT = document.getElementById("output");

let isProcessing = false;





async function getAltText(imageData, type) {
  isProcessing = true
  loading()
  const prompt = "guess the drawing, short answer, in portuguese";
  const image = {
    inlineData: {
      data: imageData,
      mimeType: type,
    },
  };

  const result = await model.generateContent([prompt, image]);
  isProcessing = false
  OUTPUT.textContent = result.response.text()
}

async function loading() {
  const chars = ["-", "\\", "|", '/']
  while (isProcessing) {
    for (const char of chars) {
      if (isProcessing) {
        OUTPUT.textContent = char
      }
      await sleep(200)
    }
  }
}





const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const type = "image/jpeg";

let lastDrawTime = Date.now()

let isDrawing = false;

context.lineCap = "round";





fillCanvas()
function fillCanvas() {
  context.fillStyle = "#fefce8";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000000";
}

setInterval(() => {
  if (Date.now() - lastDrawTime < 20000) {
    getAltText(canvas.toDataURL(type).split(',')[1], type);
  }
}, 10000)





canvas.addEventListener('mousedown', function (e) {
  isDrawing = true;
  context.beginPath();
  context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener('mousemove', function (e) {
  if (isDrawing) {
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.stroke();
    lastDrawTime = Date.now()
  }
});

canvas.addEventListener('mouseup', function () {
  isDrawing = false;
});

canvas.addEventListener('mouseleave', function () {
  isDrawing = false;
});


const clearButton = document.getElementById('clear');
clearButton.addEventListener("click", () => {
  fillCanvas()
})

const colorPicker = document.getElementById('color');
colorPicker.addEventListener("change", (event) => {
  context.strokeStyle = event.target.value;
})

const lineWidthInput = document.getElementById('line');
lineWidthInput.value = context.lineWidth = 5
lineWidthInput.addEventListener("change", (event) => {
  context.lineWidth = event.target.value;
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}