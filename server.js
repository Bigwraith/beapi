const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');

// 引入Router
const Router = require('./routes/api/index');

// mongo config 数据库地址
const db = require('./config/keys').mongoURI;
// 连接mongodb数据库
mongoose.connect(db, { 
    useUnifiedTopology: true,
    useNewUrlParser: true
    })
    .then(() => {
        console.log('连接成功')
    })
    .catch(err => {
        console.log(err);
    })


// app.get('/', (req, res) => {
//     res.send('hhhh')
// })

// body-parser中间插件
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// 全局 中间件  解决所有路由的 跨域问题
// app.all('*',function (req,res,next) {
//     res.header('Access-Control-Allow-Origin','*')
//     res.header('Access-Control-Allow-Headers','X-Requested-With,Content-Type')
//     res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS')
//     next()
// })
app.use( (req, res, next) => { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

// 使用Router
app.use(Router);

// 使用passport初始化
app.use(passport.initialize());

require('./config/passport')(passport)

// 端口号
const port = process.env.PORT || 5000;

app.listen( port, () => {
    console.log( `server running on port ${port}` );
})