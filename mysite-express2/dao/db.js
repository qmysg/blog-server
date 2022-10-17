//初始化数据库
const sequelize = require("./dbConnect");
const adminModel = require("./model/adminModel");
const md5 = require("md5");
(async () => {
  //将数据模型和表进行同步
  await sequelize.sync({ alter: true });

  //一些表需要初始化数据
  const adminCount = await adminModel.count();
  if (!adminCount) {
    //表为空
    await adminModel.create({
      loginId: "admin",
      name: "超级管理员",
      loginPwd: md5("123456"),
    });
    console.log("初始化管理员数据完毕");
  }
  console.log("数据库数据准备完毕");
})();