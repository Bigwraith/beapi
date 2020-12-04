// login & register

const express = require("express");
const router = express.Router();

// 加密模块
const bcrypt = require('bcrypt');

// 头像模块
const gravatar = require('gravatar');

// token模块
const jwt = require('jsonwebtoken');

const keys = require('../../config/keys');

// passport模块
const passport = require('passport');

// 引入model User
const User = require('../../models/User')

router
  .get ('/test', (req, res) => {
    res.json ({
      msg: "123",
    });
  })
  
  // @route GET users/register
  // @desc 用户注册接口
  // @access public
  .post (
    '/register', (req, res, next) => {
      // console.log(req.body);
      
      // 查询数据库中是否存在邮箱
      User.findOne ({
        email: req.body.email
      })
      .then ( data => {
        if ( data ) {
          return res.status (404).json('邮箱已被注册')
        } else {

          const avatar = gravatar.url (req.body.email, { s: '200', r: 'pg', d: 'mm' });

          const newUser = new User ({
            name: req.body.name,
            email: req.body.email,
            avatar,
            identity: req.body.identity,
            password: req.body.password
          })

          // 密码加密
          bcrypt.genSalt (10, (err, salt) => {
            bcrypt.hash (newUser.password, salt, (err, hash) => {
              if ( err ) throw err
              newUser.password = hash;

              newUser.save ( (res,err) =>{
                if (err) {
                  console.log(err)
                } else {
                  // console.log('Save success');
                  res.json (newUser) 
                }
              })            
            });
        });
        }
      })  
    },
    (err) => {
      console.log(err);
    }
  )
  
  // @route GET users/register
  // @desc 用户登录接口
  // @access public
  .post ('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // 查询数据库中是否存在邮箱
    User.findOne ({ email })
        .then ( user => {
          if ( !user ) return res.status(404).json('用户不存在')
          
          // 密码匹配
          // 第一种写法
          // bcrypt.compare(password, data.password, (err, result) => {
          //   // result == true
          //   if (result) res.json({msg: 'login sucess'})
          // })
          // 第二种写法
          bcrypt.compare (password, user.password)
                .then ( isMach => { // isMach是结果，如果为true则输出内容
                  if ( !isMach ) return res.status(404).json('密码不正确')
                  // res.json({ msg: 'login sucess' })

                  // 使用token jwt.sign({"规则","加密名字","过期时间","箭头函数"})
                  const rule = { 
                    id: user.id, 
                    name: user.name,
                    avatar: user.avatar,
                    identity: user.identity
                  }
                  jwt.sign (rule, keys.secretOrKey, { expiresIn: 1000 }, (err, token) => {
                    // console.log(token);
                    if ( err ) throw err
                    res.json({
                      // token: token, 
                      token: "Bearer " + token,
                      msg: 'sucess'
                    })
                  })
                 
                  

                })

        })
  })
  
  // @route GET users/current
  // @desc 获取用户信息
  // @access private
  //验证token得到用户信息
  //使用passport-jwt验证token
  .get('/current', passport.authenticate("jwt",{session:false}), (req, res) => {
    // res.json({msg:"success"});
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity
    })
  })

module.exports = router;
