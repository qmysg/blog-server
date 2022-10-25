var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { expressjwt: jwt } = require("express-jwt");
var md5 = require("md5");
var { ForbiddenError, UnknownError, ServiceError } = require("./utils/error");
const session = require("express-session");

var app = express();

//引入环境变量
require("dotenv").config();
require("express-async-errors");
//数据库链接
require("./dao/db");
//引入路由
var adminRouter = require("./routes/admin");
var captchaRouter = require("./routes/captcha");
var bannerRouter = require("./routes/banner");
var uploadRouter = require("./routes/upload");
var blogTypeRouter = require("./routes/blogType");
var blogRouter = require("./routes/blog");
var demoRouter = require("./routes/demo");
var messageRouter = require("./routes/message");
var settingRouter = require("./routes/setting");
var aboutRouter = require("./routes/about");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

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
    path: [
      { url: "/api/admin/login", methods: ["POST"] },
      { url: "/res/captcha", methods: ["GET"] },
      { url: "/api/banner", methods: ["GET"] },
      { url: "/api/blogtype", methods: ["GET"] },
      { url: "/api/blog", methods: ["GET"] },
      { url: /\/api\/blog\/\d/, methods: ["GET"] },
      { url: "/api/project", methods: ["GET"] },
      { url: "/api/comment", methods: ["GET", "POST"] },
      { url: "/api/message", methods: ["GET", "POST"] },
      { url: "/api/setting", methods: ["GET"] },
      { url: "/api/about", methods: ["GET"] },
    ],
  })
);

//路由
app.use("/api/admin", adminRouter);
app.use("/res/captcha", captchaRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/blogtype", blogTypeRouter);
app.use("/api/blog", blogRouter);
app.use("/api/project", demoRouter);
app.use("/api/comment", messageRouter);
app.use("/api/message", messageRouter);
app.use("/api/setting", settingRouter);
app.use("/api/about", aboutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//错误处理
app.use(function (err, req, res, next) {
  console.log("err.name>>>", err.name);
  console.log("err.message>>>", err.message);
  if (err.name === "UnauthorizedError") {
    res.send(new ForbiddenError("未登录或登录已过期").toResponseJSON());
  } else if (err instanceof ServiceError) {
    res.send(err.toResponseJSON());
  } else {
    res.send(new UnknownError().toResponseJSON());
  }
});

module.exports = app;
