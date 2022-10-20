var express = require("express");
var router = express.Router();
const captchaService = require("../service/captchaService");

router.get("/", async function (req, res, next) {
  const captcha = await captchaService();
  req.session.captcha = captcha.text;
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(captcha.data);
});

module.exports = router;
