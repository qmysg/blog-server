const jwt = require("jsonwebtoken");
const md5 = require("md5");
const multer = require("multer");
const path = require("path");
const toc = require("markdown-toc");

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

//文件上传
module.exports.uploading = multer({
  storage,
  limits: {
    fileSize: 2000000,
    files: 1,
  },
});

//处理TOC
module.exports.handleTOC = function (info) {
  //获取所有标题数组
  let result = toc(info.markdownContent).json;

  //将目录数组转换为有层级的结构
  function transfer(flatArr) {
    //初始化目录
    function handleTOCItem(item) {
      return {
        name: item.content,
        anchor: item.slug,
        level: item.lvl,
        children: [],
      };
    }

    //创建目录的层级结构
    function handleItem(item) {
      const top = stack[stack.length - 1];
      if (!top) {
        //栈内无内容
        stack.push(item);
      } else if (top.level < item.level) {
        top.children.push(item);
        stack.push(item);
      } else {
        stack.pop();
        handleItem(item);
      }
    }

    const stack = []; //栈
    const result = []; //最终结果
    let min = 6; //标题等级

    for (const i of flatArr) {
      //获得最大级标题
      if (i.lvl < min) {
        min = i.lvl;
      }
    }

    //初始化目录，并根据层级进行嵌套
    for (const item of flatArr) {
      const itemToc = handleTOCItem(item);
      if (itemToc.level === min) {
        //该目录已经是最大级
        result.push(itemToc);
      }
      handleItem(itemToc);
    }
    return result;
  }
  info.toc = transfer(result);

  delete info.markdownContent;

  //设置锚链接
  for (const i of result) {
    switch (i.lvl) {
      case 1: {
        let newStr = `<h1 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h1>", newStr);
      }
      case 2: {
        let newStr = `<h2 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h2>", newStr);
      }
      case 3: {
        let newStr = `<h3 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h3>", newStr);
      }
      case 4: {
        let newStr = `<h4 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h4>", newStr);
      }
      case 5: {
        let newStr = `<h5 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h5>", newStr);
      }
      case 6: {
        let newStr = `<h6 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h6>", newStr);
      }
    }
  }

  return info;
};
