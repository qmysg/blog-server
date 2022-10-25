var express = require("express");
var router = express.Router();
const {
  findSettingService,
  updateSettingService,
} = require("../service/settingService");

//获取全局配置
router.get("/", async function (req, res, next) {
  res.send(await findSettingService());
});

//修改全局配置
router.put("/", async function (req, res, next) {
  res.send(await updateSettingService(req.body));
});

module.exports = router;
