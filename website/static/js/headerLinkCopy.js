/* eslint-disable */

// Get all the headers with anchor links. 
// The 'click' event worked over 'popstate' because click captures page triggers, as well as back/forward button triggers
// Adding the 'load' event to also capture the initial page load
window.addEventListener("click", copyHeader);
window.addEventListener("load", copyHeader);

// separating function from eventlistener to understand they are two separate things
function copyHeader () {
  const headers = document.querySelectorAll("h2.anchor, h3.anchor, h4.anchor");

  headers.forEach((header) => {
    header.style.cursor = "pointer";

    // Remove trailing `-` if exists
    header = removeTrailingDashes(header)

    const clipboard = new ClipboardJS(header, {
      text: function(trigger) {
          const anchorLink = trigger.getAttribute("id");
          return window.location.href.split('#')[0] + '#' + anchorLink;
      }
    });

    clipboard.on('success', function(e) {
      // Provide user feedback (e.g., alert or tooltip) here
      const popup = document.createElement('div');
      popup.classList.add('copy-popup');
      popup.innerText = 'Link copied!';
      document.body.appendChild(popup);

      // Set up timeout to remove the popup after 3 seconds
      setTimeout(() => {
          document.body.removeChild(popup);
      }, 3000);

      // Add close button ('x')
      const closeButton = document.createElement('span');
      closeButton.classList.add('close-button');
      closeButton.innerHTML = ' &times;'; // '×' symbol for 'x'
      closeButton.addEventListener('click', () => {
          if (document.body.contains(popup)) {
              document.body.removeChild(popup);
          }
      });
      popup.appendChild(closeButton);

      // Add and remove the 'clicked' class for styling purposes
      e.trigger.classList.add("clicked");
      setTimeout(() => {
        e.trigger.classList.remove("clicked");
    }, 1500);
  });

    clipboard.on('error', function(e) {
        console.error("Unable to copy to clipboard: " + e.text);
    });
  });
};

// Util function to remove trailing dashes from ID attribute on headers
function removeTrailingDashes(header) {
  // Create copy of header element
  const updatedHeader = header;

  // Get id attribute
  const thisId = updatedHeader?.getAttribute("id");

  // If header's id ends with trailing dash, remove dash
  if (thisId?.endsWith("-")) {
    // Remove `-` from end of ID string
    updatedHeader.id = thisId?.substring(0, thisId?.length - 1);

    // Recursively run function to check for another trailing slash
    removeTrailingDashes(updatedHeader);
  }

  return updatedHeader;
}
