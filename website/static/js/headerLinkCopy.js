/* eslint-disable */

// Function to add the lifecycle badge
function addLifecycleBadge(headers) {
    headers.forEach((header) => {
        // Check if the header contains the Lifecycle component
        const lifecycleMatch = header.innerHTML.match(/<Lifecycle status="(.+?)" \/>/);
        if (lifecycleMatch) {
            // Normalize the status to lowercase and replace spaces with hyphens
            const statusClass = lifecycleMatch[1].toLowerCase().replace(/\s+/g, '-');
            badge.classList.add("lifecycle-badge", statusClass);
            
            // Remove the Lifecycle component from the header text
            header.innerHTML = header.innerHTML.replace(/<Lifecycle status=".+?" \/>/, "");
            
            // Create the badge
            const badge = document.createElement("span");
            badge.classList.add("lifecycle-badge", statusClass);
            badge.textContent = lifecycleMatch[1]; // e.g., "Beta"
            
            // Insert the badge before the header text
            header.insertBefore(badge, header.firstChild);
        }
    });
}

// Function to add the copy button functionality
function addCopyButton(headers) {
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
        });

        clipboard.on('error', function(e) {
            console.error("Unable to copy to clipboard: " + e.text);
        });
    });
}

// Event listener for when the DOM content is loaded
window.addEventListener("click", function() {
    const headers = document.querySelectorAll("h2.anchor, h3.anchor");
    addLifecycleBadge(headers);
    addCopyButton(headers);
});
