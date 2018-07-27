const express = require("express");
const exphbs  = require('express-handlebars');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session')
const flash = require("connect-flash");
const methodOverride = require('method-override');
const passport = require('passport');
const bcrypt = require('bcrypt');

const app = express();

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);  

const db = require("./config/database");



// Connect to mongoose
mongoose.connect(db.mongoURL)
        .then(() => {
          console.log("MongoDB connected....");
        })
        .catch(err => {
          console.log(err);
        })








// 引入模型
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

// 使用静态文件
app.use(express.static(path.join(__dirname,'public')));
// app.use(express.static(path.join(__dirname,'avator')));

// method-override middleware
app.use(methodOverride('_method'));

// session & flash middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// 配置全局变量
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; //全局变量 navbar
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




/*//去到添加页面
app.get("/ideas/add",(req,res)=>{
	res.render("ideas/add");
})
//去到编辑页面
app.get("/ideas/edit/:id",(req,res)=>{
	Idea.findOne({
		_id:req.params.id
	})
	.then(idea=>{
		res.render("ideas/edit",{
			idea:idea
		});
	})
	
})



//去到处理页面展示信息
app.get("/ideas",(req,res)=>{
	Idea.find({})
		.sort({date:"desc"})
		.then(ideas=>{
			res.render("ideas/index",{
				ideas:ideas
			});
		})
	})


//去到post
app.post("/ideas",urlencodedParser,(req,res)=>{
	// console.log(req.body);
	let errors =[];
	if(!req.body.title){
		errors.push({text:"请输入标题!"});
	}
	if(!req.body.details){
		errors.push({text:"请输入详情!"});
	}
	if(errors.length>0){
		// console.log(errors);
		res.render("ideas/add",{
			errors:errors,
			title:req.body.title,
			details:req.body.details
		})//检验出错回到这个页面
	}else{
		// res.send("ok");
		const newUser = {
			title:req.body.title,
			details:req.body.details
		}
		new Idea(newUser)
			.save()
			.then(idea=>{
				req.flash("success_msg","数据添加成功!")
				res.redirect('/ideas')
			})
	}
})

//编辑
app.put("/ideas/:id",urlencodedParser,(req,res)=>{
	// res.send("PUT");
	Idea.findOne({
		_id:req.params.id
	})
	.then(idea=>{
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea=>{
				req.flash("success_msg","数据编辑成功!")
				res.redirect('/ideas')
			})
	})
})
//删除
app.delete("/ideas/:id",(req,res)=>{
	// res.send("PUT");
	Idea.remove({
		_id:req.params.id
	})
	.then(()=>{
		req.flash("success_msg","数据删除成功!")
		res.redirect('/ideas')
	})
})*/

//加载ueditor 模块
var ueditor = require("ueditor");

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

//使用模块
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
 
        var imgname = req.ueditor.filename;
 
        var img_url = '/images/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/jsp/config.json');
    }
}));





// 使用routes
app.use("/ideas",ideas);
app.use("/users",users);

const port = process.env.PORT || 5000;
app.listen(port,()=>{
	console.log(`Server started on ${port}`);
})





