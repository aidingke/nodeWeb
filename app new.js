const express =require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require("connect-flash");


const app = express();
//load routes
const ideas = require('./routes/ideas');


//连接数据库
mongoose.connect("mongodb://localhost/mydbs")
        .then(() => {
          console.log("MongoDB connected....");
        })
        .catch(err => {
          console.log(err);
        })
//引入模型
require("./models/Idea");
const Idea = mongoose.model('ideas');


// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main' //主模版是main
}));
app.set('view engine', 'handlebars');

// body-parser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// method-override middleware
app.use(methodOverride('_method'));

// session & flash middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(flash());
// 配置全局变量
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  // res.locals.user = req.user || null;
  next();
})



//配置路由
app.get("/",(req,res)=>{
	const title ="大家好，来看看demo";
	res.render("index",{
		title:title
	}); //去到首页模版
})
app.get("/about",(req,res)=>{
	res.render("about");
})

// 使用routes
app.use("/",ideas);


//users login & register
app.get("/users/login",(req,res)=>{
	res.send("login");
}) 
app.get("/users/register",(req,res)=>{
	res.send("register");
}) 


const port = 5000;
app.listen(port,()=>{
	console.log(`Server started on ${port}`);
})





