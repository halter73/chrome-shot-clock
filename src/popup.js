// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

function sendMessage(event) {
  let message = event.target.value;
  chrome.browserAction.setBadgeText({ text: message });
  chrome.runtime.sendMessage({ action: message });
  window.close();
}

document.querySelectorAll('button').forEach(button => button.addEventListener('click', sendMessage));
