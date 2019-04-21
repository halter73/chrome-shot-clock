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
document.querySelector('input[type=number]').addEventListener('input', updateSeconds);

async function loadFont() {
  const font = new FontFace("DSEG7", "url(DSEG7Classic-Bold.woff2)");
  await font.load();
  document.fonts.add(font);
}

// If we don't do this, the clock looks fuzzy on high-DPI displays.
function initCanvas(width, height) {
  const canvas = document.querySelector('canvas');
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  return ctx;
}

async function drawClock() {
  await loadFont();

  const ctx = initCanvas(100, 100);

  ctx.font = '60px DSEG7';
  ctx.fillStyle = '#c43200';
  ctx.fillText('2.4', 0, 60);
}

drawClock();
