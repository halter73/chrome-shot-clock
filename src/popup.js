'use strict';

document.querySelectorAll('button').forEach(button => button.addEventListener('click', event => {
  chrome.runtime.sendMessage({ action: event.target.value });
  window.close();
}));

const startingSecondsInput = document.querySelector('input[type=number]');
startingSecondsInput.addEventListener('input', async event => {
  chrome.runtime.sendMessage({ action: 'update', seconds: event.target.value });
  await chrome.storage.sync.set({ startingSeconds: event.target.value });
});
(async () => {
  var startingSeconds = (await chrome.storage.sync.get('startingSeconds')).startingSeconds || 24;
  startingSecondsInput.value = startingSeconds;
  startingSecondsInput.disabled = false;
})();