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

let intervalHandle = null;
let startingSeconds = 24;

chrome.runtime.onMessage.addListener(message => {
  switch (message.action) {
    case 'start':
      clearInterval(intervalHandle);
      let seconds = startingSeconds;

      chrome.browserAction.setBadgeText({ text: `${seconds}` });

      intervalHandle = setInterval(() => {
        chrome.browserAction.setBadgeText({ text: `${--seconds}` });

        if (seconds === 0) {
          notify('Bzzzzzzzzzzz!');
        } else if (seconds <= -300) {
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
