document.getElementById('generate').addEventListener('click', () => {
    const url = document.getElementById('url').value;
  
    if (url) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
  
        // Update the current tab to the provided URL
        chrome.tabs.update(activeTab.id, { url }, () => {
          // Wait for the new URL to load
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === activeTab.id && changeInfo.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
  
              // Inject the content script into the updated tab
              chrome.scripting.executeScript(
                {
                  target: { tabId: activeTab.id },
                  files: ['content.js']
                },
                () => {
                  // Send a message to the content script to extract citation data
                  chrome.tabs.sendMessage(activeTab.id, { action: 'getCitationData' }, (response) => {
                    const { title, author } = response;
                    const citation = `${author ? author + ', ' : ''}"${title}"`;
                    document.getElementById('citation').innerText = citation;
                  });
                }
              );
            }
          });
        });
      });
    } else {
      alert("Please enter a URL.");
    }
  });
  