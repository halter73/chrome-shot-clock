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

chrome.runtime.onMessage.addListener(message => {
  if (message.action === 'start') {
    let seconds = 24;

    let intervalHandle = setInterval(() => {
      chrome.browserAction.setBadgeText({ text: `${--seconds}` });

      if (seconds === 0) {
        clearInterval(intervalHandle);
        notify("Bzzzzzzzzzzz!");
      }
    }, 1000);
  } else {
      notify(`Action: ${message.action}`);
  }
});

chrome.notifications.onButtonClicked.addListener(() => {

});