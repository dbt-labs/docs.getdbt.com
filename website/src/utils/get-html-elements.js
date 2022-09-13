// Returns a promise with elements
// This is used for elements which may not be
// immediately available on page load
export default function getElements(group) {
  return new Promise((resolve) => {
    let count = 0
    const eleInt = setInterval(function() {
      const elements = document.querySelectorAll(group)
      if(count < 10) {
        if(elements && elements.length) {
          resolve(elements)
          clearInterval(eleInt)
        } else {
          count++
        }
      } else {
        clearInterval(eleInt)
      }
    }, 500)
  })
}
