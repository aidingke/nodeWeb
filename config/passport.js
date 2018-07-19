const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load user model
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    // Match user
    // console.log(email,password);
    User.findOne({
      email:email
    }).then(user => {
      if(!user){
        return done(null, false, {message: 'No User Found 没有这个用户！'});
      } 

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          //console.log(user);
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password Incorrect 密码错误！'});
        }
      })
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}