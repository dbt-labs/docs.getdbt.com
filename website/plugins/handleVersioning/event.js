import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
export default (function() {
  console.log('event run')
  if (!ExecutionEnvironment.canUseDOM) {
     return null;
  }
  let event = new Event('onRouteUpdated');
  console.log('event', event)
  return {
    onRouteUpdate() {
      document.dispatchEvent(event);
      const version = window.localStorage.getItem('version')
      if(!version)
        return
      
      console.log('version', version)
    },
  }
})();
