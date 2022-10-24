const blogTypeModel = require("./model/blogTypeModel");

//添加分类
module.exports.addBlogTypeDao = async function (blogTypeInfo) {
  const { dataValues } = await blogTypeModel.create(blogTypeInfo);
  return dataValues;
};

//获取分类
module.exports.findAllBlogTypeDao = async function () {
  return await blogTypeModel.findAll();
};

//获取一个分类
module.exports.findBlogTypeDao = async function (id) {
  return await blogTypeModel.findByPk(id);
};

//修改一个分类
module.exports.updateBlogTypeDao = async function (blogTypeInfo, id) {
  await blogTypeModel.update(blogTypeInfo, {
    where: {
      id,
    },
  });
  const { dataValues } = await blogTypeModel.findByPk(id);
  return dataValues;
};

//删除一个分类
module.exports.deleteBlogTypeDao = async function (id) {
  await blogTypeModel.destroy({
    where: {
      id,
    },
  });
};

//添加文章后对应分类数量加一
module.exports.addBlogtoType = async function (id) {
  const blogType = await blogTypeModel.findByPk(id);
  blogType.articleCount++;
  blogType.save();
  return;
};
