// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

function sendMessage(event) {
  chrome.runtime.sendMessage({ action: event.target.value });
  window.close();
}

function updateSeconds(event) {
  chrome.runtime.sendMessage({ action: 'update', seconds: event.target.value });
}

document.querySelectorAll('button').forEach(button => button.addEventListener('click', sendMessage));
document.querySelector('input[type=number]').addEventListener('input', updateSeconds)