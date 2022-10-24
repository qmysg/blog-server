const {
  findAllDemoDao,
  addDemoDao,
  updateDemoDao,
  deleteDemoDao,
} = require("../dao/demoDao");
const { formatResponse, handleDataPattern } = require("../utils/tool");
const validate = require("validate.js");
const { ValidationError } = require("../utils/error");

//获取所有项目
module.exports.findAllDemoService = async function () {
  const data = await findAllDemoDao();
  const obj = handleDataPattern(data);
  obj.forEach((item) => {
    item.description = JSON.parse(item.description);
  });
  return formatResponse(0, "", obj);
};

//新增项目
module.exports.addDemoService = async function (newDemoInfo) {
  newDemoInfo.description = JSON.stringify(newDemoInfo.description);
  const demoRule = {
    description: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    name: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    url: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    github: {
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
    order: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
    },
  };
  const validateResult = validate.validate(newDemoInfo, demoRule);
  if (!validateResult) {
    const data = await addDemoDao(newDemoInfo);
    data.description = JSON.parse(data.description);
    return formatResponse(0, "", data);
  } else {
    throw new ValidationError("数据验证失败");
  }
};

//修改项目
module.exports.updateDemoService = async function (id, newDemoInfo) {
  if (newDemoInfo.description) {
    newDemoInfo.description = JSON.stringify(newDemoInfo.description);
  }
  const data = await updateDemoDao(id, newDemoInfo);
  data.description = JSON.parse(data.description);
  return formatResponse(0, "", data);
};

//删除项目
module.exports.deleteDemoService = async function (id) {
  await deleteDemoDao(id);
  return formatResponse(0, "", true);
};
