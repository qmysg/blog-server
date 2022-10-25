const { findSettingDao, updateSettingDao } = require("../dao/settingDao");
const { formatResponse } = require("../utils/tool");

//获取全局配置
module.exports.findSettingService = async function () {
  const data = await findSettingDao();
  return formatResponse(0, "", data);
};

//修改全局配置
module.exports.updateSettingService = async function (newSettingInfo) {
  const data = await updateSettingDao(newSettingInfo);
  console.log(data, "data>>>");
  return data;
};
