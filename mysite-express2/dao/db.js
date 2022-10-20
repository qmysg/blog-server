//初始化数据库
const sequelize = require("./dbConnect");
const adminModel = require("./model/adminModel");
const bannerModel = require("./model/bannerModel");
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
  const bannerCount = await bannerModel.count();
  if (!bannerCount) {
    await bannerModel.bulkCreate([
      {
        midImg: "中图地址",
        bigImg: "大图地址",
        title: "凛冬将至",
        description: "人唯有恐惧的时候方能勇敢",
      },
      {
        midImg: "中图地址",
        bigImg: "大图地址",
        title: "血火同源",
        description: "如果我回头，一切都完了",
      },
      {
        midImg: "中图地址",
        bigImg: "大图地址",
        title: "听我怒吼",
        description: "兰尼斯特有债必偿",
      },
    ]);
    console.log("初始化首页标语完成");
  }
  console.log("数据库数据准备完毕");
})();
