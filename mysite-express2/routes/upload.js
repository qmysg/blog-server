var express = require("express");
const multer = require("multer");
const { UploadError } = require("../utils/error");
const { uploading, formatResponse } = require("../utils/tool");
var router = express.Router();

// 获取首页标语
router.post("/", function (req, res, next) {
  uploading.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(new UploadError("上传文件失败，请检查文件的大小，控制在 2MB 以内"));
    } else {
      const path = "/static/uploads/" + req.file.filename;
      res.send(formatResponse(0, "", path));
    }
  });
});

module.exports = router;
