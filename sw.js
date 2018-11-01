
//https://developers.google.com/web/tools/workbox/guides/get-started
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  //https://developers.google.com/web/tools/workbox/guides/configure-workbox
  workbox.setConfig({ debug: false }); //Force Production Builds, if you want for developement , you can comment this 

  //Custom cache name . By using this you can have multiple cache names under same hostname.
  workbox.core.setCacheNameDetails({
    prefix: 'yashwanth',
    suffix: 'korla'
  });

  //You can alter the log level by using workbox.core.setLogLevel(workbox.core.LOG_LEVEL.debug) . 
  // Instead of debug you can use log warn silent error.



  //The array inside the precacheandroute will be filled with workbox cli or you can manually enter the files that needs
  // to be cached while installing the service worker.
  //You can refer workbox cli pre caching page :https://developers.google.com/web/tools/workbox/guides/precache-files/
  //In this i used npm to install workbox cli and used workbox wizard --injectmanifest and workbox injectManifest, you can read about them in the above link.
  workbox.precaching.precacheAndRoute([]);


  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
      // Use a custom cache name
      cacheName: 'yashwanth-css-cache',
    })
  );


  //Background_sync Docs
  //https://developers.google.com/web/tools/workbox/modules/workbox-background-sync
  //https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.backgroundSync.Queue
  //https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.backgroundSync.Plugin

  const bgSyncPlugin = new workbox.backgroundSync.Plugin('yashwanth_queue', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
  });

  workbox.routing.registerRoute(
    /http:\/\/localhost:1337\/reviews/,
    workbox.strategies.networkOnly({
      plugins: [bgSyncPlugin]
    }),
    'POST'
  );

  //cache js  other than pre-cached files like links of third party js and css.
  workbox.routing.registerRoute(
    /.*\.js/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'yashwanth-cache-other-js-pre-cached',
    }),
  );

  //caching restaurants
  workbox.routing.registerRoute(
    new RegExp('restaurant.html(.*)'),
    workbox.strategies.networkFirst({
      cacheName: 'yashwanth-cache-restaurants'
    })
  );


} else {
  console.log(`Boo! Workbox didn't load 😬`);
}