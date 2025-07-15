chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'fetch-pollinations') {
    fetch(request.url)
      .then(response => response.text())
      .then(data => sendResponse({ data }))
      .catch(error => sendResponse({ error: error.toString() }));
    return true; // Keep the message channel open for async response
  }
}); 