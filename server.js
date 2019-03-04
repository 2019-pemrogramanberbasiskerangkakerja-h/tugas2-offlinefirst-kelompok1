//Initialized
const express = require('express');
const nSQL = require('nano-sql').nSQL;
var data = require('./user-data.json');
var datapassword = require('./user-password.json');
var bodyParser = require('body-parser');
var session = require('express-session');

const app = express();

//Using Express-Session
app.use(session({
  secret : 'ahoy',
  resave : true,
  saveUninitialized : false
}));

//Using bodyparser
app.use(bodyParser.urlencoded({
  extended : true
}));

app.use(express.static(__dirname+'/build'));

//STATUS
var ok = {
  'status' : "ok",
  'code' : 200
}
var wrong = {
  'status' : "ok",
  'code' : 401
}

//Creating Users & Password table
nSQL("users")
.model([
  { key: "id_user",type:"int",props:["pk","ai"]},
  { key: "username",type:"string"}
]);
nSQL("password")
.model([
  { key: "id_user", type:"int",props:["pk","ai"]},
  { key : "password", type :"string"}
])
.connect() //Connect to DB
.then(()=>{
  nSQL("users").query("upsert",data).exec();
  nSQL("password").query("upsert",datapassword).exec();

 //Route
 app.get('/menu',(req,res)=>{
   console.log("AAAA");
   var sess= req.session.user;
   console.log(sess);
     res.sendFile(__dirname+'/build/menu/index.html');
 });

  app.get("/",(req,res)=>{
    var sess = req.session.user; //Kalau ada session user redirect ke Menu, jika tidak redirect ke Login page
    if(sess){
      res.redirect('/menu');
    }
    else{
      res.sendFile(__dirname +  '/build/index.html');
    }
  });

  app.get('/logout',(req,res)=>{ //Logout Route
    var sess = req.session.user;
    if(sess){
      req.session.user = null;
      console.log(sess.username + " logout");
      return res.redirect('/');
    }
  });

  app.get('/api/getUser',(req,res)=> { //Fetching data user
    nSQL("users").query("select").exec().then((rows)=>{
      console.log("get user");
      res.status(200);
      res.set({
        'Content-Type' : 'application/json',
        'Content-Length' : Object.keys(data).length
      });
      res.send(rows);
      console.log(rows);
    });
  });

  app.post('/api/login',(req,res)=>{ //Login Schema
    var username = req.body.username;
    var password = req.body.password;
    nSQL("users").query("select").where(["username","=",username]).exec().then(function(rows){
      if(rows.length!=0){
        // console.log(rows[0].id_user);
        nSQL("password").query("select").where(["id_user","=",rows[0].id_user]).exec().then(function(rowpass){
          // console.log(rowpass);
          if(rowpass.length!=0){
            if(password==rowpass[0].password){
              req.session.user = rows[0];
              console.log("User : "+ username + " authenticated");
              return res.redirect('/menu');

            }
            else{
              return res.redirect('/');
              console.log("User : " + username + " salah password");
            }
          }
          else{
            return res.redirect('/');
            console.log("User : " + username + " salah password");
          }
        });
      }
      else{
        return res.redirect('/');
        console.log("Salah username & password");
      }
    });
    return;

  });

  app.listen(3000,() => console.log("PORT : 3000 Connected")); //start server
});
