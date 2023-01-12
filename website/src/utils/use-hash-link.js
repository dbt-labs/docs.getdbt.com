export default function useHashLink() {
  if (window.location.hash) {
    const hashLink = document.getElementById(
      window.location.hash.replace("#", "")
    );
    if (hashLink) {
      hashLink.scrollIntoView();
    }
  }
}
