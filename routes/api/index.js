const express = require('express');
const app = express();


// 引入user.js
const users = require('./users')

// 使用user.js
// app.use(users)
app.use('/user', users)

module.exports = app