const blogModel = require("./model/blogModel");
const blogTypeModel = require("./model/blogTypeModel");

//添加文章
module.exports.addBlogDao = async function (newBlogInfo) {
  const { dataValues } = await blogModel.create(newBlogInfo);
  return dataValues;
};

//分页获取文章
module.exports.findBlogByPageDao = async function (blogInfo) {
  if (blogInfo.categoryId && blogInfo.categoryId !== "-1") {
    //根据分类获取文章
    return await blogModel.findAndCountAll({
      include: [
        {
          model: blogTypeModel,
          as: "category",
          where: {
            id: blogInfo.categoryId,
          },
        },
      ],
      offset: (blogInfo.page * 1 - 1) * blogInfo.limit,
      limit: blogInfo.limit * 1,
    });
  } else {
    return await blogModel.findAndCountAll({
      include: [
        {
          model: blogTypeModel,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      offset: (blogInfo.page * 1 - 1) * blogInfo.limit,
      limit: blogInfo.limit * 1,
    });
  }
};

//获取一篇文章
module.exports.findOneBlogDao = async function (id) {
  return await blogModel.findByPk(id, {
    include: [
      {
        model: blogTypeModel,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
  });
};

//修改一篇文章
module.exports.updateBlogDao = async function (id, blogInfo) {
  await blogModel.update(blogInfo, {
    where: {
      id,
    },
  });
  return await blogModel.findByPk(id, {
    include: [
      {
        model: blogTypeModel,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
  });
};

//删除一篇文章
module.exports.deleteBlogDao = async function (id) {
  return await blogModel.destroy({
    where: {
      id,
    },
  });
};
