importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js');
// importScripts('http://localhost:3000/js/app.js');
const baseUrl = location.origin;
//Creating cache after fetching from server route
workbox.routing.registerRoute(
  new RegExp('/api/getUser'),
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
    "url": "fonts/font-awesome-4.7.0/fonts/fontawesome-webfont.eot",
    "revision": "674f50d287a8c48dc19ba404d20fe713"
  },
  {
    "url": "fonts/font-awesome-4.7.0/fonts/fontawesome-webfont.svg",
    "revision": "acf3dcb7ff752b5296ca23ba2c7c2606"
  },
  {
    "url": "fonts/font-awesome-4.7.0/fonts/fontawesome-webfont.ttf",
    "revision": "b06871f281fee6b241d60582ae9369b9"
  },
  {
    "url": "fonts/font-awesome-4.7.0/fonts/fontawesome-webfont.woff",
    "revision": "fee66e712a8a08eef5805a46892932ad"
  },
  {
    "url": "fonts/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2",
    "revision": "af7ae505a9eed503f8b8e6982036873e"
  },
  {
    "url": "fonts/font-awesome-4.7.0/fonts/FontAwesome.otf",
    "revision": "0d2717cd5d853e5c765ca032dfd41a4d"
  },
  {
    "url": "fonts/font-awesome-4.7.0/HELP-US-OUT.txt",
    "revision": "e5f4d96ed70c0c372ccf7a0d9841ba53"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/animated.less",
    "revision": "7fec23ef95e17ff623af5dd5db0fc87d"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/bordered-pulled.less",
    "revision": "1f57858ac2a7ab59b01088c778f5fb0a"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/core.less",
    "revision": "da355b2c884a067eedd979b445968147"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/fixed-width.less",
    "revision": "6799c9cf7edf54b7432cca85854b0abf"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/font-awesome.less",
    "revision": "62ab0957ccd3369ed07a6d7241e7b9c1"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/icons.less",
    "revision": "ddaa02ea18934d4e03c9978f13311d5e"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/larger.less",
    "revision": "f588164c1a95535137186bbdb0d236c8"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/list.less",
    "revision": "abcbffd56677821190cf4dc72f660dd9"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/mixins.less",
    "revision": "5b203b320a03575de5f369cf49b1e7c2"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/path.less",
    "revision": "fc4e5dec2b323ba7f687b0414a6faecd"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/rotated-flipped.less",
    "revision": "2088e18f446fcf2fe91e5293fc7f2847"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/screen-reader.less",
    "revision": "79f38eb1f3eea913308f49ab5cd663bf"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/stacked.less",
    "revision": "8b7e28e004c785a0a1a73afde547b9e7"
  },
  {
    "url": "fonts/font-awesome-4.7.0/less/variables.less",
    "revision": "62803119d3ed114705a50717a53e2639"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_animated.scss",
    "revision": "79db4428659752f59630c4388bbaa174"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_bordered-pulled.scss",
    "revision": "6e194951ee06dd4cde6f94ed2ec86e47"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_core.scss",
    "revision": "d4d62bafcfb00eb1b208acbf895a95a3"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_fixed-width.scss",
    "revision": "e6fac8be09e2d3dc38fe9248b2eb0472"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_icons.scss",
    "revision": "e624b0b5cfd7ac3fcb4eefab15f983f6"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_larger.scss",
    "revision": "8b00a4d732107fc1844ea18314c3cff9"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_list.scss",
    "revision": "c33b069275c5877a4b3f144684664bf5"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_mixins.scss",
    "revision": "f07164e3950c5dac464e3f5f9e14858d"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_path.scss",
    "revision": "123f2994215b526902be3fa0596c8d13"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_rotated-flipped.scss",
    "revision": "9a3f214edda562bf122802da5c686a12"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_screen-reader.scss",
    "revision": "b4b497bdd83f580fa3942390763cc270"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_stacked.scss",
    "revision": "638e8ae84e80a3428e9446578a7ed6a0"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/_variables.scss",
    "revision": "547c9f94a31ced29cbc7f029d700a639"
  },
  {
    "url": "fonts/font-awesome-4.7.0/scss/font-awesome.scss",
    "revision": "bc5096695c4092d06d77da5329254590"
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
    "url": "fonts/iconic/fonts/Material-Design-Iconic-Font.eot",
    "revision": "e833b2e2471274c238c0553f11031e6a"
  },
  {
    "url": "fonts/iconic/fonts/Material-Design-Iconic-Font.svg",
    "revision": "381f7754080ed2299a7c66a2504dff02"
  },
  {
    "url": "fonts/iconic/fonts/Material-Design-Iconic-Font.ttf",
    "revision": "b351bd62abcd96e924d9f44a3da169a7"
  },
  {
    "url": "fonts/iconic/fonts/Material-Design-Iconic-Font.woff",
    "revision": "d2a55d331bdd1a7ea97a8a1fbb3c569c"
  },
  {
    "url": "fonts/iconic/fonts/Material-Design-Iconic-Font.woff2",
    "revision": "a4d31128b633bc0b1cc1f18a34fb3851"
  },
  {
    "url": "fonts/poppins/Poppins-Black.ttf",
    "revision": "8971d1710cbf4c91bca1b460aec154d7"
  },
  {
    "url": "fonts/poppins/Poppins-BlackItalic.ttf",
    "revision": "ad021f07d5d9269d7a7c005e2ad19eae"
  },
  {
    "url": "fonts/poppins/Poppins-Bold.ttf",
    "revision": "7940efc40d8e3b477e16cc41b0287139"
  },
  {
    "url": "fonts/poppins/Poppins-BoldItalic.ttf",
    "revision": "0952866304f326356a552d9b60a8f06e"
  },
  {
    "url": "fonts/poppins/Poppins-ExtraBold.ttf",
    "revision": "0e6906b2b7be194f68b8f7b7252c4f6c"
  },
  {
    "url": "fonts/poppins/Poppins-ExtraBoldItalic.ttf",
    "revision": "8f1e4e0b5a883ba1035b10f6bd09f19f"
  },
  {
    "url": "fonts/poppins/Poppins-ExtraLight.ttf",
    "revision": "f99f9d50a569dbcf72e3084ef1a43208"
  },
  {
    "url": "fonts/poppins/Poppins-ExtraLightItalic.ttf",
    "revision": "682c805ca8e4f6d0f66b4f9fbbb83fac"
  },
  {
    "url": "fonts/poppins/Poppins-Italic.ttf",
    "revision": "b7e7ed9f2fd6236ad791a8987d8f478f"
  },
  {
    "url": "fonts/poppins/Poppins-Light.ttf",
    "revision": "3352653dedd571bbc490c8be132b38cd"
  },
  {
    "url": "fonts/poppins/Poppins-LightItalic.ttf",
    "revision": "f86967072b9e0d95ccd5587decb10180"
  },
  {
    "url": "fonts/poppins/Poppins-Medium.ttf",
    "revision": "a4e11dda40531debd374e4c8b1dcc7f4"
  },
  {
    "url": "fonts/poppins/Poppins-MediumItalic.ttf",
    "revision": "049c11dc561dad0fdd4627417030386b"
  },
  {
    "url": "fonts/poppins/Poppins-Regular.ttf",
    "revision": "731a28a413d642522667a2de8681ff35"
  },
  {
    "url": "fonts/poppins/Poppins-SemiBold.ttf",
    "revision": "e63b93dfac2600782654e2b87910d681"
  },
  {
    "url": "fonts/poppins/Poppins-SemiBoldItalic.ttf",
    "revision": "e650e72170e79b589af1fbdf46b03676"
  },
  {
    "url": "fonts/poppins/Poppins-Thin.ttf",
    "revision": "735aa7d8e35b63068b9113ea2545f0c3"
  },
  {
    "url": "fonts/poppins/Poppins-ThinItalic.ttf",
    "revision": "cffb0ae21d03a32e81d5f2193c4a711d"
  },
  {
    "url": "images/icons/favicon.ico",
    "revision": "7d4140c76bf7648531683bfa4f7f8c22"
  },
  {
    "url": "images/icons/love.png",
    "revision": "07fd640b10b101868727baf3184aee0b"
  },
  {
    "url": "index/index.html",
    "revision": "b45bfd3efa15c9687178649d8442a66c"
  },
  {
    "url": "js/app.js",
    "revision": "c0b2f5f8ba8178f79f4ffd3f74c108fe"
  },
  {
    "url": "js/idb-promised.js",
    "revision": "59df18a7433f090282337136440403f7"
  },
  {
    "url": "menu/index.html",
    "revision": "1e34f5973fd42a610bdb5c3a3c26e6ed"
  },
  {
    "url": "register/index.html",
    "revision": "efd4a58c52a33d26b64d32def3802716"
  },
  {
    "url": "workbox-sw.js",
    "revision": "b89e47af54e6339c1b5bea01c3eb575e"
  }
]);
