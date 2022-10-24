const demoModel = require("./model/demoModel");

//获取所有项目
module.exports.findAllDemoDao = async function () {
  return await demoModel.findAll();
};

//新增项目
module.exports.addDemoDao = async function (newDemoInfo) {
  const { dataValues } = await demoModel.create(newDemoInfo);
  return dataValues;
};

//修改项目
module.exports.updateDemoDao = async function (id, newDemoInfo) {
  await demoModel.update(newDemoInfo, {
    where: {
      id,
    },
  });
  const { dataValues } = await demoModel.findByPk(id);
  return dataValues;
};

//删除项目
module.exports.deleteDemoDao = async function (id) {
  await demoModel.destroy({
    where: {
      id,
    },
  });
};
