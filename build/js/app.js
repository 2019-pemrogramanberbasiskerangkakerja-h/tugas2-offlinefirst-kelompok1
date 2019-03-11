if ('serviceWorker' in navigator) { //creating Service Worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration)=>{
  return navigator.serviceWorker.ready;
})
.then((registration)=>{
    if(form!=null){
    form.addEventListener("submit",async (e)=>{
      e.preventDefault();
      // console.log("AAAA");
        if(navigator.onLine){ //done
          var body = {
            username : username.value,
            password : password.value
          }
          fetch("/api/login",{
            headers : {
              "Content-Type" : "application/json"
            },
            method : 'POST',
            body : JSON.stringify(body)
          }).then((resp)=>{
            return resp.json();
          }).then(async (body)=>{
            if(body.token!=null){
              localStorage.setItem("token",body.token);
              await setCookie("username",username.value,1);
              window.location.replace("/menu/");
            }
            else{
              alert("Salah password / username");
            }
          })
        }
        else{ // bug setelah register
          if(await checkUsername(username.value,password.value) && password.value!=""){
            await setCookie("username",username.value,1);
            var body ={
              form : "login",
              username : username.value,
              password : password.value
            }
            await newDB.then(db=>{
              const tx = db.transaction('queuedata','readwrite');
              const store = tx.objectStore('queuedata');
              return store.put(JSON.stringify(body));
            });
            window.location.replace("/menu/index.html");
          }
          else{
            alert("Salah username");
          }
        }
      });
  }
  if(logout!=null){ //done
    logout.addEventListener('click',async (e)=>{
      e.preventDefault();
      if(navigator.onLine){
        await setCookie("username","",0);
        localStorage.removeItem("token");
        fetch("/logout").then((response)=> response.json()).then((data)=>{
          window.location.replace("/");
        })
      }
      else{ //done
        await setCookie("username","",0);
        localStorage.removeItem("token");
        window.location.replace("/index/");
      }
    });
  }
  if(register!=null){ //register function
    register.addEventListener('submit',async (e)=>{
      e.preventDefault();
      if(navigator.onLine){ //online register
        var body = {
          username : username.value,
          password : password.value
        }
        fetch("/api/register",{
          headers:{
            "Content-Type" : "application/json"
          },
          method : 'POST',
          body : JSON.stringify(body)
        }).then((resp)=>resp.json()).then((data)=>{
          if(data.token!=null){
            if(window.confirm("Silahkan login di user page")){
              window.location.replace("/");
            }
          }
          else{
            alert("ID sudah terdaftar");
          }
        })
      }
      else{ //offline register
        if(await checkNewUser(username.value,password.value) && password.value!=""){
          var body ={
            form : "register",
            username : username.value,
            password : password.value
          }
          await insertDB(username.value,password.value);
          await newDB.then(db=>{
            const tx = db.transaction('queuedata','readwrite');
            const store = tx.objectStore('queuedata');
            return store.put(JSON.stringify(body));
          });
          if(window.confirm("Silahkan login di user page")){
            window.location.replace("/index/index.html");
          }
        }
        else{
          alert("Username sudah terdaftar atau password kosong");
        }
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
var param = localStorage.getItem("token");

window.onload = cihuy();

function cihuy(){
  if(!checkQuery() && param!=null){
    addQuery();
  }
}

function checkQuery(){
  var field = "token";
  var url = window.location.href;
  if(url.indexOf('?' + field + '=')!= -1) return true;
  else if(url.indexOf('&'+field+'=')!=-1)return true;
  return false;
}


function addQuery(){
  var url = location.href;
  var param = localStorage.getItem("token");
  url+= (url.split('?')[1] ? '&' : '?') + "token=" +param;
  window.location.replace(url);
}



const createDB = createIndexDB();
const newDB = createnewDB();
const form = document.getElementById('formi');
const username  = document.getElementById('username');
const password = document.getElementById('password');
const viewName = document.getElementById('name');
const logout = document.getElementById('logout');
const register = document.getElementById('regis');
var login_off=localStorage.getItem('login');
var register_off=localStorage.getItem('register');
setNameCookie();

window.addEventListener('online',go);

function createnewDB(){
  if(!('indexedDB' in window)) {return null;}
  return idb.open('queuedata',1,function(isiDB){
    if(!isiDB.objectStoreNames.contains('queuedata')){
      const isi = isiDB.createObjectStore('queuedata',{keypath:"id",autoIncrement: true})
    }
  });
}

function getQueue(){
  return newDB.then(db=>{
    const tx = db.transaction('queuedata','readonly');
    const store = tx.objectStore('queuedata');
    return store.getAll();
  });
}

async function go(){
  console.log("Sync started");
  getQueue()
  .then(async (queue)=>queue.forEach(async (q,id) =>{
    var result = JSON.parse(q);
    if(result.form == "login"){
      console.log("ini login");
      var usr = result.username;
      var pss = result.password;
      var body = {
        username : usr,
        password : pss
      }
      await fetch("/api/login",{
        headers : {
          "Content-Type" : "application/json"
        },
        method : "POST",
        body : JSON.stringify(body)
      }).then((resp)=>{
        return resp.json();
      }).then(async (body)=>{
        if(body.token!=null){
          localStorage.setItem("token",body.token);
          await setCookie("username",usr,1);
        }
      })
    }
    else if(result.form=="register"){
      console.log("ini regis");
      var usr = result.username;
      var pss = result.password;
      var body = {
        username : usr,
        password : pss
      };
      await fetch("/api/register",{
        headers : {
          "Content-Type" : "application/json"
        },
        method : "POST",
        body : JSON.stringify(body)
      }).catch((err)=> console.log(err));
    }
    await deleteIndexNEWDB(id);

  }))
}

// console.log(document.getElementById('formi'));

async function insertDB(username,pass){
  var body = {
    username : username,
    password : pass
  };
  console.log(body);
  await createDB.then(db=>{
    const tx = db.transaction('userdata','readwrite');
    const store = tx.objectStore('userdata');
    // return Promise.all(datas.map(data=> store.put(data)))
    return store.add(body);
  });
}

async function deleteIndexNEWDB(id){
  return newDB.then(async (db)=>{
    const tx = db.transaction('queuedata','readwrite');
    const store = tx.objectStore('queuedata');
    return store.delete(id);
  });
}

async function checkNewUser(usr,pass){
  console.log(usr +" " +pass);
  var hai=true;
  await getUsr().then(response=>response.forEach(async resp =>{
    if(resp.username==usr && resp.password==pass){
      console.log("HH");
      hai=false;
      // break;
    }
  }));
  if(hai==true) return true;
  console.log("BB");
  return false;
}

async function checkUsername(usr,pass){
  console.log(usr +" " +pass);
  var hai=false;
  await getUsr().then(response=>response.forEach(async resp =>{
    if(resp.username==usr && resp.password==pass){
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


async function setCookie(name, value, days) {
  console.log(name + " " + value );
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

//Pengecekan doang
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
      const isi = isiDB.createObjectStore('userdata',{keypath:"username",autoIncrement: true})
      .createIndex("username","username",{unique:true});
    }
  });
}
