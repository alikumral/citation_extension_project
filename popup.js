document.getElementById('generate').addEventListener('click', () => {
    const url = document.getElementById('url').value;
  
    if (url) {
      chrome.tabs.create({ url }, (tab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
  
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                function: extractCitationData,
              },
              (results) => {
                const { title, author } = results[0].result;
                const citation = `${author ? author + ', ' : ''}"${title}"`;
                document.getElementById('citation').innerText = citation;
              }
            );
          }
        });
      });
    } else {
      alert("Please enter a URL.");
    }
  });
  
  function extractCitationData() {
    const title = document.querySelector('title')?.innerText || 'No title found';
    const authorMeta = document.querySelector('meta[name="author"]');
    const author = authorMeta ? authorMeta.getAttribute('content') : 'No author found';
  
    return { title, author };
  }
  