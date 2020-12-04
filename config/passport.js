// const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('user');
const keys = require('./keys');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();  //通过配置信息来生成jwt的请求，验证这个token
opts.secretOrKey = keys.secretOrKey;


module.exports = passport => {
    passport.use (new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);
        User.findById (jwt_payload.id)
            .then (user => { 
                // 判断用户是否存在存在返回数据
                if (user) { return done(null, user) }
                return done(null, false)
            })
            .catch ( err => console.log(err) )
    }))
}