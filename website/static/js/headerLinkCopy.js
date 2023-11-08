/* eslint-disable */

window.addEventListener("load", function () {
    // Get all the headers with anchor links
    const headers = document.querySelectorAll("h2.anchor, h3.anchor"); 
  console.log("headers",headers);
    headers.forEach((header) => {
      header.style.cursor = "pointer";
      const clipboard = new ClipboardJS(header, { 
        text: function(trigger) {
          const anchorLink = trigger.getAttribute('href');
          return window.location.href.split('#')[0] + anchorLink;
        }
      });
  
      clipboard.on('success', function(e) {
        // Provide user feedback (e.g., alert or tooltip) here
        alert("Link copied to clipboard: " + e.text);
      });
  
      clipboard.on('error', function(e) {
        console.error("Unable to copy to clipboard: " + e.text);
      });
    });
  });
