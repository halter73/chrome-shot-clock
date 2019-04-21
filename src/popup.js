'use strict';

function sendMessage(event) {
  chrome.runtime.sendMessage({ action: event.target.value });
  window.close();
}

function updateSeconds(event) {
  chrome.runtime.sendMessage({ action: 'update', seconds: event.target.value });
}

document.querySelectorAll('button').forEach(button => button.addEventListener('click', sendMessage));
document.querySelector('input[type=number]').addEventListener('input', updateSeconds);

async function loadFont() {
  const font = new FontFace("DSEG7", "url(DSEG7Classic-Bold.woff2)");
  await font.load();
  document.fonts.add(font);
}

// If we don't do this, the clock looks fuzzy on high-DPI displays.
function initPopupCanvas(width, height) {
  const canvas = document.querySelector('canvas');
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  return ctx;
}

function fillCanvasWithClock(context, size) {
  const fontSize = .6 * size;
  context.font = `${fontSize}px DSEG7`;
  context.fillStyle = '#c43200';
  context.fillText('2.4', 0, fontSize);
}

function getClockImage(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  fillCanvasWithClock(context, size);
  return context.getImageData(0, 0, size, size);
}

function replaceIcon() {
  chrome.browserAction.setIcon({
    imageData: {
      get 16() {
        return getClockImage(16);
      },
      get 32() {
        return getClockImage(32);
      },
      get 48() {
        return getClockImage(48);
      },
      get 128() {
        return getClockImage(128);
      },
    }
  });
}

async function drawClock() {
  await loadFont();

  const popupContext = initPopupCanvas(100, 100);
  fillCanvasWithClock(popupContext, 100);

  replaceIcon();
}

drawClock();
