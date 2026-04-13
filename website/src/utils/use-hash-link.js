// Track the last pathname and hash we scrolled to
let lastScrolledPathname = '';
let lastScrolledHash = '';

export default function useHashLink() {
  if (window.location.hash) {
    const hashLink = document.getElementById(
      window.location.hash.replace("#", "")
    );
    if (hashLink) {
      const currentPathname = window.location.pathname;
      const currentHash = window.location.hash;
      
      // Only scroll if:
      // 1. We're on a new page (pathname changed), OR
      // 2. The hash changed (user clicked a different anchor link)
      // This prevents scrolling when tabs with queryString are clicked (query params change but hash stays the same)
      if (lastScrolledPathname !== currentPathname || lastScrolledHash !== currentHash) {
        // Make sure the nav is hidden if loaded from an anchor link
        // Prevents the nav from covering the hash link content
        const navbar = document.getElementsByClassName("navbar")[0];
        navbar.classList.add("navbarHiddenOnLoad");

        let scrollPos = 0;
        window.addEventListener('scroll', function(){
          if ((document.body.getBoundingClientRect()).top > scrollPos) {
            navbar.classList.remove("navbarHiddenOnLoad");
          }
          scrollPos = (document.body.getBoundingClientRect()).top;
        });

        hashLink.scrollIntoView();
        lastScrolledPathname = currentPathname;
        lastScrolledHash = currentHash;
      }
    }
  }
}
