const aboutModel = require("./model/aboutModel");

//获取关于页面
module.exports.findAboutDao = async function () {
  const { dataValues } = await aboutModel.findOne();
  return dataValues;
};

//设置关于页面
module.exports.updateAboutDao = async function (newAboutInfo) {
  const data = await aboutModel.findOne();
  data.url = newAboutInfo;
  data.save();
  return data.dataValues;
};
