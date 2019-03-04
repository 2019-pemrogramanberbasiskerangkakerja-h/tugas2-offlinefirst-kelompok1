if ('serviceWorker' in navigator) { //creating Service Worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration)=>{
  return navigator.serviceWorker.ready;
})
.then((registration)=>{
    if(form!=null){
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      // console.log("AAAA");
        if(navigator.onLine){
          console.log("AAA");
          setCookie("username",username.value,50);
          document.formii.action = "/api/login";
          form.submit();
        }
        else{
          if(checkUsername(username.value) && password.value!=""){
            setCookie("username",username.value,50);
            registration.sync.register('login').then(()=>{
              console.log("sync registered");
              window.location.replace("http://localhost:3000/menu/index.html");
            });
          }
          else{
            alert("Salah username");
          }
        }
      });
  }
  if(logout!=null){
    logout.addEventListener('click',(e)=>{
      e.preventDefault();
      if(navigator.onLine){
        setCookie("username","",-1);
        window.location.replace("http://localhost:3000/logout");
      }
      else{
        setCookie("username","",-1);
      }
    });
  }
      })
      .catch(err => {
        console.log(`Service Worker registration failed: ${err}`);
      });
  });
}

// isOnline();


const createDB = createIndexDB();
const form = document.getElementById('formi');
const username  = document.getElementById('username');
const password = document.getElementById('password');
const viewName = document.getElementById('name');
const logout = document.getElementById('logout');
setNameCookie();

// console.log(document.getElementById('formi'));

async function checkUsername(usr){
  var hai=false;
  await getUsr().then(response=>response.forEach(resp =>{
    if(resp.username==usr){
      console.log("HH");
      hai=true;
      // break;
    }
  }));
  if(hai==true) return true;
  console.log("BB");
  return false;
}

function getUsr(){
  return createDB.then(db=>{
    const tx = db.transaction('userdata','readonly');
    const store = tx.objectStore('userdata');
    return store.getAll();
  });
}


function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";expires=" + d.toGMTString();
}

function setNameCookie(){
  if(viewName!=null){
    viewName.innerHTML = getCookie("username")
  }
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

fetch('http://localhost:3000/api/getUser')
   .then(response => response.json())
   .then(datas=>{
     createDB.then(db =>{
      const tx = db.transaction('userdata','readwrite');
      const store = tx.objectStore('userdata');
      // console.log(datas);
      return Promise.all(datas.map(data=> store.put(data)))
      .catch(err =>{
        console.log(err);
        tx.abort();
      });
     })
   });


function createIndexDB(){
  if(!('indexedDB' in window)) {return null;}
  return idb.open('userdata',1,function(isiDB){
    if(!isiDB.objectStoreNames.contains('userdata')){
      const isi = isiDB.createObjectStore('userdata',{keypath:"id_user",autoIncrement: true})
      .createIndex("id_user","id_user",{unique:true});
    }
  });
}
