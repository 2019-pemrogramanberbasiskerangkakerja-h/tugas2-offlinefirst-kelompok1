//Initialized
const express = require('express');
const nSQL = require('nano-sql').nSQL;
var jwt = require('jsonwebtoken');
var data = require('./user-data.json');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs= require('fs');

const app = express();

//Using bodyparser
app.use(bodyParser.urlencoded({
  extended : true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/build'));

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
   res.sendFile(__dirname+'/build/menu/index.html');
 });

  app.get("/",(req,res)=>{
    var token = req.query.token;
    if(!token){
      console.log("Token empty");
      res.sendFile(__dirname + '/build/index/index.html');
    }
    else{
      jwt.verify(token,'ahoy',function(err,decoded){
        if(err){
          res.sendFile(__dirname + '/build/index/index.html');
          console.log("Token session abis");
        }
        console.log("Token Verified");
        res.redirect('/menu');
      })
    }
    });

  app.get('/logout',(req,res)=>{ //Logout Route
    res.status(200).send({auth:false,token:null});
  });

  app.get('/register',(req,res)=>{
    res.sendFile(__dirname+'/build/register/index.html');
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
            res.status(404).send({message : "ID sudah terdaftar"});
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
             var token = jwt.sign({id:username},'ahoy',{expiresIn:86400});
             res.status(200).send({auth:true,token:token});
             console.log("ACC "+ username + " terdaftar");
                 }
             })


  });

  app.post('/api/login',(req,res)=>{ //Login Schema
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    nSQL("users").query("select").where([["username","=",username],"and",["password","=",password]]).exec().then(function(rows){
      if(rows.length!=0){
        // console.log(rows[0].id_user);
        var token = jwt.sign({id: username},'ahoy', {
          expiresIn : 86400
        });
        res.status(200).send({auth:true, token: token});
        console.log(username + " berhasil login");
      }
      else{
        res.status(404).send({message : "Wrong username/password"});
        console.log("Salah username");
      }
    });
    return;

  });

  app.listen(3000,() => console.log("PORT : 3000 Connected")); //start server
});
