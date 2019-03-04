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


workbox.precaching.precacheAndRoute([]);
