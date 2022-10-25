const messageModel = require("../dao/model/messageModel");
const blogModel = require("../dao/model/blogModel");
const { Op } = require("sequelize");

//分页获取留言
module.exports.findMessageDao = async function (infoObj) {
  //参数blogid值是博客id，值为-1查询所有文章评论，
  //没有blogid代表查询留言
  if (infoObj.blogid) {
    if (infoObj.blogid == "-1") {
      return await messageModel.findAndCountAll({
        where: {
          blogId: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: blogModel,
            as: "blog",
            attributes: ["id", "title"],
          },
        ],
        offset: (infoObj.page * 1 - 1) * infoObj.limit,
        limit: infoObj.limit * 1,
      });
    } else {
      return await messageModel.findAndCountAll({
        where: {
          blogId: infoObj.blogid * 1,
        },
        offset: (infoObj.page * 1 - 1) * infoObj.limit,
        limit: infoObj.limit * 1,
        order: [["createDate", "DESC"]],
      });
    }
  } else {
    return await messageModel.findAndCountAll({
      where: {
        blogId: null,
      },
      offset: (infoObj.page * 1 - 1) * infoObj.limit,
      limit: infoObj.limit * 1,
      order: [["createDate", "DESC"]],
    });
  }
};

//提交留言
module.exports.addMessageDao = async function (NewMessageInfo) {
  const { dataValues } = await messageModel.create(NewMessageInfo);
  return dataValues;
};

//删除留言
module.exports.deleteMessageDao = async function (id) {
  await messageModel.destroy({
    where: {
      id,
    },
  });
};

//删除文章对应的所有评论
module.exports.deleteComment = async function (blogId) {
  await messageModel.destroy({
    where: {
      blogId,
    },
  });
};
