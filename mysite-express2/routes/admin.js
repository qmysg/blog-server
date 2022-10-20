var express = require("express");
var router = express.Router();
const { loginService } = require("../service/adminService");
const { formatResponse, analysisToken } = require("../utils/tool");
const { updateAdminService } = require("../service/adminService");

//登录
router.post("/login", async function (req, res, next) {
  //处理验证码

  //验证账号和密码
  const result = await loginService(req.body);
  if (result.token) {
    res.setHeader("authentication", result.token);
  }
  res.send(formatResponse(0, "", result.data));
});

//恢复登录状态
router.get("/whoami", async function (req, res, next) {
  const token = req.get("Authorization");
  const result = analysisToken(token);
  res.send(
    formatResponse(0, "", {
      loginId: result.loginId,
      name: result.name,
      id: result.id,
    })
  );
});

//修改信息
router.put("/", async function (req, res, next) {
  res.send(await updateAdminService(req.body));
});

module.exports = router;
