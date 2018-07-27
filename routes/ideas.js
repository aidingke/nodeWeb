const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const router = express.Router();
const pubFun = require('../config/public.js');
const {ensureAuthenticated} = require('../helpers/auth');
const ueditor = require("ueditor");


// var app = express();

// 引入模型
require("../models/Idea");
const Idea = mongoose.model('ideas');

// body-parser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// 课程
// 因为app.js 已经引入/ideas,所以得去掉ideas 
//去到处理页面展示信息
router.get("/",ensureAuthenticated,(req,res)=>{
  Idea.find({user:req.user.id})
    .sort({date:"desc"})
    .then(ideas=>{
      // console.log(ideas)

      res.render("ideas/index",{
        ideas:ideas
      });
    })
  })

//去到添加页面
router.get("/add",ensureAuthenticated,(req,res)=>{
  res.render("ideas/add");
})


//去到查看页面查看详情
router.get("/details/:id",ensureAuthenticated,(req,res)=>{
  Idea.findOne({
    _id:req.params.id
  })
  .then( idea => {
    if(idea.user != req.user.id){
      req.flash("error_msg","非法操作~!");
      res.redirect("/ideas");
    }else{
      res.render("ideas/details",{
        idea:idea
      });
    }
  })  
})


//去到编辑页面查找一条记录
router.get("/edit/:id",ensureAuthenticated,(req,res)=>{
  Idea.findOne({
    _id:req.params.id
  })
  .then( idea => {
    if(idea.user != req.user.id){
      req.flash("error_msg","非法操作~!");
      res.redirect("/ideas");
    }else{
      res.render("ideas/edit",{
        idea:idea
      });
    }
  })  
})



//去到post
router.post("/",urlencodedParser,(req,res)=>{
  // console.log(req.body);
  let errors =[];
  if(!req.body.title){
    errors.push({text:"请输入标题!"});
  }
  if(!req.body.description){
    errors.push({text:"请输入简短描述!"});
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
    var timestamp=new Date().getTime();
    var timeNow = pubFun.dateFormat(timestamp,'Y年m月d日 H时i分s秒');

    const newUser = {
      title:req.body.title,
      details:req.body.details,
      user:req.user.id,
      date:timeNow
    }
    new Idea(newUser)
        .save()
        .then(idea => {
          req.flash("success_msg","数据添加成功!");
          res.redirect('/ideas')
        })
  }
})

//编辑
router.put("/:id",urlencodedParser,(req,res)=>{
  // res.send("PUT");

  var timestamp=new Date().getTime();
  var timeNow = pubFun.dateFormat(timestamp,'Y年m月d日 H时i分s秒');

  Idea.findOne({
    _id:req.params.id
  })
  .then(idea=>{
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.description = req.body.description;
    
    idea.date = timeNow;
    idea.save()
      .then(idea => {
        req.flash("success_msg","数据编辑成功!");
        res.redirect('/ideas');
      })
  });
})
//删除
router.delete("/:id",ensureAuthenticated,(req,res)=>{
  // res.send("PUT");
  Idea.remove({
    _id:req.params.id
  })
  .then(() => {
    req.flash("success_msg","数据删除成功!");
    res.redirect("/ideas");
  })
})


module.exports = router;