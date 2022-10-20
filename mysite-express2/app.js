var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { expressjwt: jwt } = require("express-jwt");
var md5 = require("md5");
var { ForbiddenError } = require("./utils/error");

var app = express();

//引入环境变量
require("dotenv").config();
//数据库链接
require("./dao/db");
//引入路由
var adminRouter = require("./routes/admin");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//验证token接口
app.use(
  jwt({
    secret: md5(process.env.JWT_SECRET),
    algorithms: ["HS256"],
  }).unless({
    //不需要验证的路由
    path: [{ url: "/api/admin/login", methods: ["POST"] }],
  })
);

//路由
app.use("/api/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//错误处理
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.send(new ForbiddenError("未登录或登录已过期").toResponseJSON());
  }
});

module.exports = app;
