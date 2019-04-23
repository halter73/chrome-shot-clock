'use strict';

function notify(message) {
  chrome.notifications.create({
      type:     'basic',
      iconUrl:  'shot-clock-800.png',
      title:    'Shot Clock',
      message:  message,
      buttons: [
        {title: 'Reset'}
      ],
      priority: 0});
}

async function loadFont() {
  const font = new FontFace("DSEG7", "url(DSEG7Classic-Bold.woff2)");
  await font.load();
  document.fonts.add(font);
}

function fillCanvasWithClock(context, text, size) {
  const fontSize = .7 * size;
  context.font = `${fontSize}px DSEG7`;
  context.fillStyle = '#c43200';
  context.fillText(text, -2, fontSize * 1.25);
}

function getClockImage(text, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  fillCanvasWithClock(context, text, size);
  return context.getImageData(0, 0, size, size);
}

function replaceIcon(text) {
  chrome.browserAction.setIcon({
    imageData: {
      get 16() {
        return getClockImage(text, 16);
      },
      get 32() {
        return getClockImage(text, 32);
      },
      get 48() {
        return getClockImage(text, 48);
      },
      get 128() {
        return getClockImage(text, 128);
      },
    }
  });
}

async function drawClock(text) {
  await loadFont();

  chrome.browserAction.setBadgeText({ text: '' });
  replaceIcon(text);
}

let intervalHandle = null;
let startingSeconds = 24;

chrome.runtime.onMessage.addListener(message => {
  switch (message.action) {
    case 'start':
      clearInterval(intervalHandle);
      let seconds = startingSeconds;

      drawClock(seconds);

      intervalHandle = setInterval(() => {
        --seconds;

        if (seconds > 0) {
          drawClock(seconds);
        } else if (seconds === 0) {
          notify('Bzzzzzzzzzzz!');
          drawClock(seconds);
        } else if (seconds >= -300) {
          chrome.browserAction.setBadgeText({ text: `${seconds}` });
        } else {
          clearInterval(intervalHandle);
        }
      }, 1000);
      break;
    case 'stop':
      clearInterval(intervalHandle);
      break;
    case 'reset':
      clearInterval(intervalHandle);
      chrome.browserAction.setBadgeText({ text: `${startingSeconds}` });
      break;
    case 'update':
      startingSeconds = message.seconds;
      break;
    default:
      notify(`Action: ${message.action}`);
  }
});

chrome.notifications.onButtonClicked.addListener(() => {

});
