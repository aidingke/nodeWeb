const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const pubFun = require('../config/public.js');
const {ensureAuthenticated} = require('../helpers/auth');

// body-parser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// 加载model
require('../models/User');
const User = mongoose.model("users");


// users login & register
router.get("/login",(req,res) => {
  res.render("users/login");
})


router.post("/login",urlencodedParser,(req,res,next) => {
  passport.authenticate('local', {
    successRedirect:'/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
  // 查询数据库
  /*User.findOne({email:req.body.email})
      .then((user) => {
        if(!user){
          req.flash("error_msg","用户不存在!");
          res.redirect("/users/login");
          return;
        }

        // 密码验证
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if(err) throw err;

          if(isMatch){
            req.flash("success_msg","登录成功!");
            res.redirect("/ideas");
          }else{
            req.flash("error_msg","密码错误!");
            res.redirect("/users/login");
          }
        });
      })*/
})



//上传头像
router.get("/setavator/:id",ensureAuthenticated,(req,res) => {
  res.render("users/setavator");
})
//上传业务逻辑处理
router.post("/setavator/:id",urlencodedParser,(req,res,next) => {
  // var timestamp=Date.parse(new Date());
  
  // 用ID 作后缀
  var form = new formidable.IncomingForm();
  form.uploadDir = path.normalize(__dirname + '/../public/avator');
  form.parse(req, (err, fields, files) => {
    var oldpath = files.avator.path;
    var newpath = path.normalize(__dirname + '/../public/avator') + '/' + req.params.id + '.jpg';
    fs.rename(oldpath, newpath, (err) => {
      if (err) {
        res.send('失败！');
        return;
      }
      var avator = req.params.id + '.jpg';
      //更改数据库当前用户的avatar这个值

      User.findOne({
        _id:req.params.id
      })
      .then((user)=>{
        user.avator = avator;
   
        user.save().then(user=>{
          req.flash("success_msg","头像更新成功");
          res.redirect('/ideas');
        })
      })


  /*User.findOne({_id:req.params.id})
      .then((user) => {
        if(!user){
          req.flash("error_msg","用户不存在!");
          res.redirect("/users/login");
          return;
        }else{
          console.log('用户存在!');
        }
      })*/







    });
  });
})




router.get("/register",(req,res) => {
  res.render("users/register");
})

router.post("/register",urlencodedParser,(req,res) => {
  // console.log(req.body);
  // res.send("register");
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({
      text:"两次的密码不一致!"
    })
  }

  if(req.body.password.length < 4){
    errors.push({
      text:"密码的长度不能小于4位!"
    })
  }

  if(errors.length > 0){
    res.render('users/register',{
      errors:errors,
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      password2:req.body.password2
    })
  }else{
    

    User.findOne({email:req.body.email})
      .then((user) => {
        if(user){
          req.flash("error_msg","邮箱已经存在, 请更换邮箱注册~!");
          res.redirect("/users/register");
        }else{
          var timestamp=new Date().getTime();
          var timeNow = pubFun.dateFormat(timestamp,'Y年m月d日 H时i分s秒');

          // 头像用默认的
          var avator = 'head.jpg';

          const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            date:timeNow,
            avator:avator
          })

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then((user) => {
                  req.flash("success_msg","账号注册成功!");

                  // passport.authenticate('local', {
                  //   successRedirect:'/ideas',
                  //   failureRedirect: '/users/register',
                  //   failureFlash: true
                  // })(req, res, next);


                  res.redirect('/users/login');
                }).catch((err) => {
                  req.flash("error_msg","账号注册失败!");
                  res.redirect("/users/register")
                });
            });
          });
          
        }
      })

    
  }
})


// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', '退出登录成功');
  res.redirect('/users/login');
});



module.exports = router;