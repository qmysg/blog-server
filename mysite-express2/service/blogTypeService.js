const {
  addBlogTypeDao,
  findAllBlogTypeDao,
  findBlogTypeDao,
  updateBlogTypeDao,
  deleteBlogTypeDao,
} = require("../dao/blogTypeDao");
const { formatResponse, handleDataPattern } = require("../utils/tool");
const validate = require("validate.js");
const { ValidationError } = require("../utils/error");

//添加分类
module.exports.addBlogTypeService = async function (blogTypeInfo) {
  const blogTypeRule = {
    name: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    order: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
  };

  const validateResult = validate.validate(blogTypeInfo, blogTypeRule);
  if (!validateResult) {
    //新建的分类没有文章数量，默认为0
    blogTypeInfo.articleCount = 0;
    return formatResponse(0, "", await addBlogTypeDao(blogTypeInfo));
  } else {
    throw new ValidationError("数据验证失败");
  }
};

//获取分类
module.exports.findAllBlogTypeService = async function () {
  const newBlogType = handleDataPattern(await findAllBlogTypeDao());
  const result = newBlogType.sort((a, b) => a.order - b.order);
  return formatResponse(0, "", result);
};

//获取一个分类
module.exports.findBlogTypeService = async function (id) {
  return formatResponse(0, "", await findBlogTypeDao(id));
};

//修改一个分类
module.exports.updateBlogTypeService = async function (blogTypeInfo, id) {
  return formatResponse(0, "", await updateBlogTypeDao(blogTypeInfo, id));
};

//删除一个分类
module.exports.deleteBlogTypeService = async function (id) {
  await deleteBlogTypeDao(id);
  //未完工,需要文章数量
  return formatResponse(0, "", true);
};
