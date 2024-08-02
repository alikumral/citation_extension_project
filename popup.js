document.getElementById('generate').addEventListener('click', () => {
    const url = document.getElementById('url').value;
  
    if (url) {
      chrome.tabs.create({ url }, (tab) => {
        // Wait for the new tab to load completely
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
  
            // Inject the content script into the newly created tab
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                files: ['content.js']
              },
              () => {
                // Send a message to the content script to extract citation data
                chrome.tabs.sendMessage(tab.id, { action: 'getCitationData' }, (response) => {
                  const { title, author } = response;
                  const citation = `${author ? author + ', ' : ''}"${title}"`;
                  document.getElementById('citation').innerText = citation;
                });
              }
            );
          }
        });
      });
    } else {
      alert("Please enter a URL.");
    }
  });
  