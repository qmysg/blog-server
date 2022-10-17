var express = require("express");
var router = express.Router();
const { loginService } = require("../service/adminService");

//登录
router.post("/login", async function (req, res, next) {
  //处理验证码

  //验证账号和密码
  const result = await loginService(req.body);
  console.log(result);
});

module.exports = router;
