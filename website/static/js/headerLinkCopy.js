/* eslint-disable */

window.addEventListener("load", function () {
    // Get all the headers with anchor links
    const headers = document.querySelectorAll("h2.anchor, h3.anchor"); 

    headers.forEach((header) => {
      header.style.cursor = "pointer";
      const clipboard = new ClipboardJS(header, { 
        text: function(trigger) {
          const anchorLink = trigger.getAttribute("id");
          return window.location.href.split('#')[0] +'#' + anchorLink;
        }
      });
  
      clipboard.on('success', function(e) {
        // Provide user feedback (e.g., alert or tooltip) here
        console.log("e",e);
        e.trigger.classList.add("clicked");
        setTimeout(() => {
          e.trigger.classList.remove('clicked')
        }, 5000) 
      });
  
      clipboard.on('error', function(e) {
        console.error("Unable to copy to clipboard: " + e.text);
      });
    });
  });
