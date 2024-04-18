(function(){var a=window.mutiny=window.mutiny||{};if(!window.mutiny.client){a.client={_queue:{}};var b=["identify","trackConversion"];var c=[].concat(b,["defaultOptOut","optOut","optIn"]);var d=function factory(c){return function(){for(var d=arguments.length,e=new Array(d),f=0;f<d;f++){e[f]=arguments[f]}a.client._queue[c]=a.client._queue[c]||[];if(b.includes(c)){return new Promise(function(b,d){a.client._queue[c].push({args:e,resolve:b,reject:d})})}else{a.client._queue[c].push({args:e})}}};c.forEach(function(b){a.client[b]=d(b)})}})();

(function(){
    var script = document.createElement('script');
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://client-registry.mutinycdn.com/personalize/client/c9e247fe670fe604.js';
    document.head.appendChild(script);
})();
