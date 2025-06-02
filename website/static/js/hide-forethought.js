(function() {
  // Check if QualifiedConversationStarted cookie set
  const qualifiedCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("QualifiedConversationStarted="))

  // If QualifiedConversationStarted cookie set, 
  // attempt to hide Forethought widget
  let intCount = 0
  if(qualifiedCookie) {
    // Start interval to allow time for Forethought widget element to load
    const interval = setInterval(function(){
      intCount++
      // Attempt to get forethought-chat widget element 5 times
      if (intCount < 10) {
        // Get Forethought widget by ID
        const forethoughtIframe = document.getElementById('forethought-chat')
        if (forethoughtIframe) {
          // If element found, hide element
          forethoughtIframe.style.display = 'none';
          clearInterval(interval)
        }
      } else {
        // Unable to retrieve Forethought element, stopping interval
        clearInterval(interval)
      }
    }, 500) 
  }
})()
