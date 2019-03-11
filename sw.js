importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js');
// importScripts('http://localhost:3000/js/app.js');
const baseUrl = location.origin;
//Creating cache after fetching from server route
workbox.routing.registerRoute(
  new RegExp('http://localhost:3000/api/getUser'),
  new workbox.strategies.CacheFirst()
);

// const url = require('url');

self.addEventListener('message',function(e){
  console.log(e);
  if(e.data.form=="login"){
    login_form = e.data.data;
  }
  if(e.data.form=="register"){
    register_form = e.data.data;
  }
});

self.addEventListener('sync',function(event){
  // console.log(event);
  console.log("TES");
  if(event.tag === "login"){
    console.log("Login fired");
    event.waitUntil(login());
  }
  if(event.tag==="logout"){
    console.log("Logout fired");
    // event.waitUntil(logout());
  }
  if(event.tag==="register"){
    console.log("Register fired");
    // event.waitUntil(register());
  }
});

function login(){
  console.log("MASUK");
  return new Promise(function(resolve,reject){
    fetch("/api/login",{
      headers : {
        "Content-Type" : "application/json"
      },
      method : 'POST',
      body : JSON.stringify(login_form)
    }).then((resp)=>resp.json()).then((resp)=>console.log(resp)).catch((err)=>console.log(err));
  });
}

function register(){

}

function logout(){

}



workbox.precaching.precacheAndRoute([]);
