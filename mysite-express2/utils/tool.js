const jwt = require("jsonwebtoken");
const md5 = require("md5");
const multer = require("multer");
const path = require("path");

module.exports.formatResponse = function (code, msg, data) {
  return {
    code,
    msg,
    data,
  };
};

//分析token
module.exports.analysisToken = function (token) {
  return jwt.verify(token.split(" ")[1], md5(process.env.JWT_SECRET));
};

//处理数组
module.exports.handleDataPattern = function (dataArr) {
  const arr = [];
  for (const i of dataArr) {
    arr.push(i.dataValues);
  }
  return arr;
};

// 设置上传文件的引擎
const storage = multer.diskStorage({
  // 文件存储的位置
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/static/uploads"));
  },
  // 上传到服务器的文件，文件名要做单独处理
  filename: function (req, file, cb) {
    // 获取文件名
    const basename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    // 获取后缀名
    const extname = path.extname(file.originalname);
    // 构建新的名字
    const newName =
      basename +
      new Date().getTime() +
      Math.floor(Math.random() * 9000 + 1000) +
      extname;
    cb(null, newName);
  },
});

module.exports.uploading = multer({
  storage,
  limits: {
    fileSize: 2000000,
    files: 1,
  },
});
