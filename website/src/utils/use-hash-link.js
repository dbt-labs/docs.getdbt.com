export default function useHashLink() {
  if (window.location.hash) {
    const hashLink = document.getElementById(
      window.location.hash.replace("#", "")
    );
    if (hashLink) {
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
    }
  }
}
