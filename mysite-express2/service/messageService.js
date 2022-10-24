const {
  findMessageDao,
  addMessageDao,
  deleteMessageDao,
} = require("../dao/messageDao");
const { findOneBlogDao } = require("../dao/blogDao");
const validate = require("validate.js");
const { UnknownError, ValidationError } = require("../utils/error");
const { formatResponse, handleDataPattern } = require("../utils/tool");
const fs = require("fs");

//头像目录
const dir = "./public/static/avatar";

//获取一个目录下有多少个文件
function redDirLength(dir) {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, files) => {
      if (err) throw new UnknownError();
      resolve(files);
    });
  });
}

//分页获取留言
module.exports.findMessageService = async function (infoObj) {
  const data = await findMessageDao(infoObj);
  const rows = await handleDataPattern(data.rows);
  return formatResponse(0, "", {
    total: data.count,
    rows,
  });
};

//提交留言
module.exports.addMessageService = async function (NewMessageInfo) {
  const messageRule = {
    nickname: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    content: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    blogId: {
      type: "string",
    },
  };

  const validateResult = validate.validate(NewMessageInfo, messageRule);
  if (validateResult) {
    throw new ValidationError("数据验证失败");
  }

  //如果有blogId,那么这是一条评论，没有是一条留言
  NewMessageInfo.blogId = NewMessageInfo.blogId ? NewMessageInfo.blogId : null;

  NewMessageInfo.createDate = JSON.stringify(Date.now());
  //随机从目录中获得一个头像地址，并添加
  const files = await redDirLength(dir);
  const randomIndex = Math.floor(Math.random() * files.length);
  NewMessageInfo.avatar = "/static/avatar" + files[randomIndex];

  const data = await addMessageDao(NewMessageInfo);
  //评论新增，那么对应的文章下评论数量也应该增加
  if (NewMessageInfo.blogId) {
    const blogData = await findOneBlogDao(NewMessageInfo.blogId);
    blogData.commentNumber++;
    blogData.save();
  }
  NewMessageInfo.createDate = JSON.parse(NewMessageInfo.createDate);
  return formatResponse(0, "", data);
};

//删除留言
module.exports.deleteMessageService = async function (id) {
  await deleteMessageDao(id);
  return formatResponse(0, "", true);
};
