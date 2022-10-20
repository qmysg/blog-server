const { findBannerDao, updateBannerDao } = require("../dao/bannerDao");
const { formatResponse, handleDataPattern } = require("../utils/tool");

//获取所有标语
module.exports.findBannerService = async function () {
  const data = await findBannerDao();
  return formatResponse(0, "", handleDataPattern(data));
};

//设置标语
module.exports.updateBannerService = async function (bannerArr) {
  const data = await updateBannerDao(bannerArr);
  return formatResponse(0, "", handleDataPattern(data));
};
