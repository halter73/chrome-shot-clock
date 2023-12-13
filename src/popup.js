'use strict';

var startingSeconds = localStorage.startingSeconds || 24;
var startingSecondsInput = document.querySelector('input[type=number]');
startingSecondsInput.value = startingSeconds;

chrome.runtime.sendMessage({ action: 'update', seconds: startingSeconds });

startingSecondsInput.addEventListener('input', event => {
  localStorage.startingSeconds = event.target.value;
  chrome.runtime.sendMessage({ action: 'update', seconds: event.target.value });
});

document.querySelectorAll('button').forEach(button => button.addEventListener('click', event => {
  chrome.runtime.sendMessage({ action: event.target.value });
  window.close();
}));