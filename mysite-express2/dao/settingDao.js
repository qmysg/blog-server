const settingModel = require("./model/settingModel");

//获取全局配置
module.exports.findSettingDao = async function () {
  const { dataValues } = await settingModel.findOne();
  return dataValues;
};

//修改全局配置
module.exports.updateSettingDao = async function (newSettingInfo) {
  await settingModel.update(newSettingInfo, {
    where: {
      id: 1,
    },
  });
  const { dataValues } = await settingModel.findOne();
  return dataValues;
};
