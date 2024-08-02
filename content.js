// Function to extract citation data from the current webpage
function extractCitationData() {
    const title = document.querySelector('title')?.innerText || 'No title found';
    const authorMeta = document.querySelector('meta[name="author"]');
    const author = authorMeta ? authorMeta.getAttribute('content') : 'No author found';
  
    // Return the extracted data
    return { title, author };
  }
  
  // Listen for messages from the popup script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCitationData") {
      const citationData = extractCitationData();
      sendResponse(citationData);
    }
  });
  