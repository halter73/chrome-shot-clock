'use strict';

function notify(message) {
  chrome.notifications.create({
      type:     'basic',
      iconUrl:  'shot-clock-800.png',
      title:    'Shot Clock',
      message:  message,
      buttons: [
        { title: 'Reset' }
      ]
    });
}

function getClockImage(text, size) {
  const fontSize = .64 * size;
  const canvas = new OffscreenCanvas(size, size);
  const context = canvas.getContext('2d');

  context.font = `${fontSize}px DSEG7`;
  context.fillStyle = '#c43200';
  context.fillText(text, 0, fontSize * 1.25);

  return context.getImageData(0, 0, size, size);
}

function replaceIcon(text) {
  chrome.action.setIcon({
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

function drawClock(text) {
  chrome.action.setBadgeText({ text: '' });
  replaceIcon(text);
}

(async () => {
  let startingSeconds = (await chrome.storage.sync.get('startingSeconds')).startingSeconds || 24;
  let timeoutHandle = null;
  let endTime = null;
  let expired = false;

  function stopClock() {
    clearTimeout(timeoutHandle);
    timeoutHandle = null;
    endTime = null;
    expired = false;
  }

  function updateClock() {
    const millisecondsFromZero = endTime - Date.now();
    const secondsFromZero = millisecondsFromZero / 1000;

    if (secondsFromZero >= 10) {
      drawClock(Math.ceil(secondsFromZero));
      timeoutHandle = setTimeout(updateClock, millisecondsFromZero % 1000);
    } else if (secondsFromZero > 0) {
      // Draw one decimal place below ten seconds.
      drawClock(secondsFromZero.toFixed(1))
      timeoutHandle = setTimeout(updateClock, millisecondsFromZero % 100);
    } else if (!expired) {
      expired = true;
      notify('Bzzzzzzzzzzz!');
      drawClock('0.0');
      timeoutHandle = setTimeout(updateClock, 1000 + millisecondsFromZero % 1000);
    } else if (secondsFromZero > -301) {
      chrome.action.setBadgeText({ text: `${Math.ceil(secondsFromZero)}` });
      timeoutHandle = setTimeout(updateClock, 1000 + millisecondsFromZero % 1000);
    } else {
      stopClock();
    }
  }

  const font = new FontFace("DSEG7", "url(DSEG7Classic-Bold.woff2)");
  await font.load();
  self.fonts.add(font);
  drawClock(startingSeconds);

  chrome.runtime.onMessage.addListener(message => {
    switch (message.action) {
      case 'start':
        stopClock();
        endTime = Date.now() + startingSeconds * 1000;
        drawClock(startingSeconds);
        timeoutHandle = setTimeout(updateClock, 1000);
        break;
      case 'stop':
        stopClock();
        break;
      case 'update':
        startingSeconds = message.seconds;
        stopClock();
        drawClock(startingSeconds);
        break;
      default:
        notify(`Action: ${message.action}`);
    }
  });

  chrome.notifications.onButtonClicked.addListener(() => {
    stopClock();
    drawClock(startingSeconds);
  })
})();