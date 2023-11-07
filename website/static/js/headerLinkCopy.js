import ClipboardJS from 'clipboard';

document.addEventListener("DOMContentLoaded", function () {
  // Get all the headers with anchor links
  const headers = document.querySelectorAll("a.anchor-header");

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
      // You can customize the feedback based on your preference
      alert("Link copied to clipboard: " + e.text);
    });

    clipboard.on('error', function(e) {
      console.error("Unable to copy to clipboard: " + e.text);
    });
  });
});
