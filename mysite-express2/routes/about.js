var express = require("express");
var router = express.Router();
const {
  findAboutService,
  updateAboutService,
} = require("../service/aboutService");

//获取关于页面
router.get("/", async function (req, res, next) {
  res.send(await findAboutService());
});

//设置关于页面
router.post("/", async function (req, res, next) {
  res.send(await updateAboutService(req.body.url));
});

module.exports = router;
