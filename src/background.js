// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
    case 'reset':
      clearInterval(intervalHandle);
      let seconds = startingSeconds;

      chrome.browserAction.setBadgeText({ text: `${seconds}` });

      intervalHandle = setInterval(() => {
        chrome.browserAction.setBadgeText({ text: `${--seconds}` });

        if (seconds === 0) {
          notify("Bzzzzzzzzzzz!");
        } else if (seconds <= -300) {
          clearInterval(intervalHandle);
        }
      }, 1000);
      break;
    case 'stop':
      clearInterval(intervalHandle);
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
