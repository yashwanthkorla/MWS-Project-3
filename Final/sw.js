
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
  workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "7113e87ad1dcf6b040e56621b377ff0f"
  },
  {
    "url": "manifest.json",
    "revision": "223a361c272efb1d7ab9cd8f897dc7a1"
  },
  {
    "url": "opt_css/style.min.css",
    "revision": "edecfe1d728c04578e773ed49c5ea831"
  },
  {
    "url": "opt_img/1.jpg",
    "revision": "cc074688becddd2725114187fba9471c"
  },
  {
    "url": "opt_img/10.jpg",
    "revision": "2bd68efbe70c926de6609946e359faa2"
  },
  {
    "url": "opt_img/2.jpg",
    "revision": "759b34e9a95647fbea0933207f8fc401"
  },
  {
    "url": "opt_img/3.jpg",
    "revision": "81ee36a32bcfeea00db09f9e08d56cd8"
  },
  {
    "url": "opt_img/4.jpg",
    "revision": "23f21d5c53cbd8b0fb2a37af79d0d37f"
  },
  {
    "url": "opt_img/5.jpg",
    "revision": "0a166f0f4e10c36882f97327b3835aec"
  },
  {
    "url": "opt_img/6.jpg",
    "revision": "eaf1fec4ee66e121cadc608435fec72f"
  },
  {
    "url": "opt_img/7.jpg",
    "revision": "bd0ac197c58cf9853dc49b6d1d7581cd"
  },
  {
    "url": "opt_img/8.jpg",
    "revision": "6e0e6fb335ba49a4a732591f79000bb4"
  },
  {
    "url": "opt_img/9.jpg",
    "revision": "ba4260dee2806745957f4ac41a20fa72"
  },
  {
    "url": "opt_img/icon/rr.png",
    "revision": "a80ec1bb662f1fc8ad58202eb5bb9d4e"
  },
  {
    "url": "opt_img/icon/rrx512.png",
    "revision": "21dba44cdc526da65f2e9c5a655217b7"
  },
  {
    "url": "opt_img/noimage.jpg",
    "revision": "3124d2c6930f4f716b92d5a5501682fb"
  },
  {
    "url": "opt_js/dbhelper.js",
    "revision": "936b27a8f40590ff43eaf1cee18fb2ac"
  },
  {
    "url": "opt_js/main.js",
    "revision": "521299eafd70ba828a4db6ef7d3b9b9e"
  },
  {
    "url": "opt_js/restaurant_info.js",
    "revision": "2f14ae76577060b209fcfe700268ec2b"
  },
  {
    "url": "opt_js/worker.js",
    "revision": "51ad47088316f117ce01e0b0b9c33e26"
  },
  {
    "url": "opt_webp/1.webp",
    "revision": "ce320a17d67a96af2784072de0589a45"
  },
  {
    "url": "opt_webp/10.webp",
    "revision": "92f021f9aa478e3e60ad7d558123ea04"
  },
  {
    "url": "opt_webp/2.webp",
    "revision": "8fd1f34e30f4a28f3582d32bedac0de6"
  },
  {
    "url": "opt_webp/3.webp",
    "revision": "7e44752e72f65f063a060244a83a2a38"
  },
  {
    "url": "opt_webp/4.webp",
    "revision": "7de4d703a089c2556071460d4efdbb9c"
  },
  {
    "url": "opt_webp/5.webp",
    "revision": "8e425eb4c30625b26a274fa5e81116be"
  },
  {
    "url": "opt_webp/6.webp",
    "revision": "26d799084fdd671b2ba9360bc4e0ec5b"
  },
  {
    "url": "opt_webp/7.webp",
    "revision": "1643ebd641a2c2abe68fc949dbb6d45e"
  },
  {
    "url": "opt_webp/8.webp",
    "revision": "18c6ec290a5914b408f5ccd90eda84fd"
  },
  {
    "url": "opt_webp/9.webp",
    "revision": "22c3f66b238e22b0f91aba7932df910b"
  },
  {
    "url": "opt_webp/icon/rr.webp",
    "revision": "7d95d625c6878b10703cdd7dc73ba884"
  },
  {
    "url": "opt_webp/icon/rrx512.webp",
    "revision": "68e1f35b8cc96a88fe3670580641d8e7"
  },
  {
    "url": "opt_webp/noimage.webp",
    "revision": "a716e63e24157c47be5eafa8aa62c502"
  },
  {
    "url": "restaurant.html",
    "revision": "38f3d2e79b42edfc099caa6786e88c75"
  }
]);


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