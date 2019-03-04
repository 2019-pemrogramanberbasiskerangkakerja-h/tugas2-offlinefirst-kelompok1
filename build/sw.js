importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js');
// importScripts('http://localhost:3000/js/app.js');
const baseUrl = location.origin;
//Creating cache after fetching from server route
workbox.routing.registerRoute(
  new RegExp('http://localhost:3000/api/getUser'),
  new workbox.strategies.StaleWhileRevalidate()
);

// const url = require('url');

self.addEventListener('sync',function(event){
  if(event.tag == "login"){
    console.log("Login fired");
  }
  if(event.tag=="logout"){
    console.log("Logout fired");
  }
});


workbox.precaching.precacheAndRoute([
  {
    "url": "css/main.css",
    "revision": "cdf5171f28698cd23db550e2f0339f60"
  },
  {
    "url": "css/style.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "css/util.css",
    "revision": "9cabf2d2ce5a30ae04a9a78140e4b73e"
  },
  {
    "url": "fonts/font-awesome-4.7.0/css/font-awesome.css",
    "revision": "4bb3dd721c4652feee0953261d329710"
  },
  {
    "url": "fonts/font-awesome-4.7.0/css/font-awesome.min.css",
    "revision": "a0e784c4ca94c271b0338dfb02055be6"
  },
  {
    "url": "fonts/iconic/css/material-design-iconic-font.css",
    "revision": "612a746cc755cfd3ceace05a85ab0da5"
  },
  {
    "url": "fonts/iconic/css/material-design-iconic-font.min.css",
    "revision": "e9365fe85b7e4db79a87015e52c3db6c"
  },
  {
    "url": "index.html",
    "revision": "2319bbeee88056ea2f240c5770b0c5bf"
  },
  {
    "url": "js/app.js",
    "revision": "31b9f8c004b40f894485a9f49f0bf900"
  },
  {
    "url": "js/idb-promised.js",
    "revision": "59df18a7433f090282337136440403f7"
  },
  {
    "url": "menu/index.html",
    "revision": "cf47d2d9c73ea1e7e3dd5f2a987c11b4"
  }
]);
