const validate = require("validate.js");
const blogTypeModel = require("../dao/model/blogTypeModel");
const {
  addBlogDao,
  findBlogByPageDao,
  findOneBlogDao,
  updateBlogDao,
  deleteBlogDao,
} = require("../dao/blogDao");
const { deleteComment } = require("../dao/messageDao");
const { addBlogtoType, findBlogTypeDao } = require("../dao/blogTypeDao");
const {
  formatResponse,
  handleDataPattern,
  handleTOC,
} = require("../utils/tool");
const { ValidationError } = require("../utils/error");

//自定义验证规则
validate.validators.categoryIdIsExist = async function (value) {
  const blogTypeInfo = await blogTypeModel.findByPk(value);
  if (blogTypeInfo) {
    return;
  }
  return "categoryId is not exist";
};

//添加文章
module.exports.addBlogService = async function (newBlogInfo) {
  //处理toc
  newBlogInfo = handleTOC(newBlogInfo);
  newBlogInfo.toc = JSON.stringify(newBlogInfo.toc);
  console.log(newBlogInfo, "newBlogInfo>>>");
  //新文章的评论量及浏览量应为0
  newBlogInfo.scanNumber = 0;
  newBlogInfo.commentNumber = 0;

  //验证规则
  const blogRule = {
    title: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    description: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    createDate: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
    },
    scanNumber: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
    },
    commentNumber: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
    },
    toc: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    htmlContent: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    thumb: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    categoryId: {
      presence: true,
      type: "integer",
      categoryIdIsExist: true,
    },
  };

  try {
    //验证规则中查询分类信息是异步的
    await validate.async(newBlogInfo, blogRule);
    const blogInfo = await addBlogDao(newBlogInfo);
    blogInfo.toc = JSON.parse(blogInfo.toc);
    await addBlogtoType(blogInfo.categoryId);
    return formatResponse(0, "", blogInfo);
  } catch (error) {
    console.log(error);
    throw new ValidationError(`验证失败`);
  }
};

//分页获取文章
module.exports.findBlogService = async function (blogInfo) {
  const data = await findBlogByPageDao(blogInfo);
  const rows = handleDataPattern(data.rows);
  rows.forEach((it) => {
    it.toc = JSON.parse(it.toc);
    delete it.categoryId;
  });
  return formatResponse(0, "", {
    total: data.total,
    rows,
  });
};

//获取一篇文章
module.exports.findOneBlogService = async function (id, auth) {
  const data = await findOneBlogDao(id);
  data.dataValues.toc = JSON.parse(data.dataValues.toc);
  if (!auth) {
    //前台查看该文章，浏览数加一
    data.scanNumber++;
    await data.save();
  }
  return formatResponse(0, "", data.dataValues);
};

//修改一篇文章
module.exports.updateBlogService = async function (id, newBlogInfo) {
  if (newBlogInfo.htmlContent) {
    //修改正文，那么toc也应该改变
    newBlogInfo = handleTOC(newBlogInfo);
    newBlogInfo.toc = JSON.stringify(newBlogInfo.toc);
  }

  //如果修改了文章分类，那么原先的文章分类数量及新的文章分类数量应该变化
  const { dataValues: oldBlogInfo } = await findOneBlogDao(id);
  if (oldBlogInfo.categoryId == null) {
    //文章未分类时
    //新分类数量加一
    const newBlogType = await findBlogTypeDao(newBlogInfo.categoryId);
    newBlogType.articleCount++;
    await newBlogType.save();
  } else if (newBlogInfo.categoryId !== oldBlogInfo.categoryId) {
    //旧分类数量减一
    const oldBlogType = await findBlogTypeDao(oldBlogInfo.categoryId);
    oldBlogType.articleCount--;
    await oldBlogType.save();

    //新分类数量加一
    const newBlogType = await findBlogTypeDao(newBlogInfo.categoryId);
    newBlogType.articleCount++;
    await newBlogType.save();
  }
  const { dataValues } = await updateBlogDao(id, newBlogInfo);
  return formatResponse(0, "", dataValues);
};

//删除一篇文章
module.exports.deleteBlogService = async function (id) {
  //获取文章信息，并根据信息获取文章种类
  const data = await findOneBlogDao(id);
  const categoryInfo = await findBlogTypeDao(data.dataValues.categoryId);
  //删除文章后，对应的分类下数量减一
  categoryInfo.articleCount--;
  await categoryInfo.save();

  //文章下的评论一同被删除
  await deleteComment(id);

  await deleteBlogDao(id);
  return formatResponse(0, "", true);
};
