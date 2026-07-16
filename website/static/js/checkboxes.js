function enableCheckboxes() {
  document.querySelectorAll("input[type='checkbox']").forEach((cb) => {
    cb.disabled = false;
  });
}

enableCheckboxes();

const observer = new MutationObserver(() => {
  enableCheckboxes();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});