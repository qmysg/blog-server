const bannerModel = require("./model/bannerModel");

module.exports.findBannerDao = async function () {
  return await bannerModel.findAll();
};

module.exports.updateBannerDao = async function (data) {
  await bannerModel.destroy({ truncate: true });
  await bannerModel.bulkCreate(data);
  return await bannerModel.findAll();
};
