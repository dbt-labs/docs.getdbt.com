/* eslint-disable */

  // Get all the headers with anchor links. 
  // The 'click' event worked over 'popstate' because click captures page triggers, as well as back/forward button triggers
  window.addEventListener("click", copyHeader);
  
  // separating function from eventlistener to understand they are two separate things
  function copyHeader () {
    const headers = document.querySelectorAll("h2.anchor, h3.anchor");
    console.log("click");

headers.forEach((header) => {
    header.style.cursor = "pointer";
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
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 3000);
    });

    clipboard.on('error', function(e) {
        console.error("Unable to copy to clipboard: " + e.text);
    });
});
};
