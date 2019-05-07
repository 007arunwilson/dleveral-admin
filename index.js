var express = require('express');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var app = express();
const dbConfig = require('./config/config.js');
const userService = require('./services/user-service.js');
var User = require("./models/user.js")
var localStorage = require('localStorage')

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();//inorder to exit from nodejs program
});


app.get('/', function(req, res){
   res.render('login');
});

app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(express.static('public'));
app.post('/admin-view', function(req, res){
  console.log('login data :', req.body);
  userService.login(req.body,res);
});
app.post('/users-list', function(req, res){
  console.log('view users :', req.body);
  userService.getUsersList(res);
});
app.post('/status', function(req, res){
   console.log('status update data :', req.body);
   userService.changeUserStatus(req,res)
   .then((result) => {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    User.find({ _id: { $ne: currentUser._id } })
    .then((users) => {
      // console.log("users:", users)
      res.send({ message: "Successfully updated the status" ,user:result})
    }, (error) => {
      console.log("error", error)
    })

   });
});
app.get('/viewUser/:userId', function(req, res){
  console.log('view user data :', req.params);
  userService.viewUser(req.params.userId)
  .then((user) => {
    console.log('success: ', user)
    res.render("viewUser", { user: user })
   }, (error) => {
     console.log("error", error)
   })
});
app.listen(3000,()=>{
    console.log("server running");
});