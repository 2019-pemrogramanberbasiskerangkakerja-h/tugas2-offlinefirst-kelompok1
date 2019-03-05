//Initialized
const express = require('express');
const nSQL = require('nano-sql').nSQL;
var data = require('./user-data.json');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs= require('fs');

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
  { key: "username",type:"string"},
  {key : "password", type:"string"}
])
.connect() //Connect to DB
.then(()=>{
  nSQL("users").query("upsert",data).exec();

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
    
  app.post('/api/register',(req,res)=>{
     var username = req.body.username;
     var password = req.body.password;
//      var obj=[];
     nSQL("users").query("select").where(["username","=",username]).exec().then(function(rows){
        if(rows.length!=0){
            res.redirect("/");
            console.log("ID sudah terdaftar");
        }
         else{
             nSQL("users").query("upsert",{username: username, password:password}).exec();
             var jeson = {
                 username : username,
                 password : password
             };
             fs.readFile('./user-data.json',function func(err,data){
                 var obj = JSON.parse(data);
                 obj.push(jeson);
                 var json = JSON.stringify(obj);
                 fs.writeFile('./user-data.json',json,function fun(err){
                     console.log(err);
                 });
             });
                     console.log("ACC "+ username + " terdaftar");
                 }
             })
     
       
  });    

  app.post('/api/login',(req,res)=>{ //Login Schema
    var username = req.body.username;
    var password = req.body.password;
    nSQL("users").query("select").where([["username","=",username],"and",["password","=",password]]).exec().then(function(rows){
      if(rows.length!=0){
        // console.log(rows[0].id_user);
        req.session.user = rows[0];
        return res.redirect('/');
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
