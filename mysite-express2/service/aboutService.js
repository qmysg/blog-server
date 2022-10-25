const { findAboutDao, updateAboutDao } = require("../dao/aboutDao");
const { formatResponse } = require("../utils/tool");

//获取关于页面
module.exports.findAboutService = async function () {
  const { url } = await findAboutDao();
  return formatResponse(0, "", url);
};

//设置关于页面
module.exports.updateAboutService = async function (newAboutInfo) {
  const { url } = await updateAboutDao(newAboutInfo);
  return formatResponse(0, "", url);
};
