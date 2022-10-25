//初始化数据库
const sequelize = require("./dbConnect");
const adminModel = require("./model/adminModel");
const bannerModel = require("./model/bannerModel");
const blogTypeModel = require("./model/blogTypeModel");
const blogModel = require("./model/blogModel");
const demoModel = require("./model/demoModel");
const messageModel = require("./model/messageModel");
const settingModel = require("./model/settingModel");
const aboutModel = require("./model/aboutModel");
const md5 = require("md5");

(async () => {
  //关联表
  //关联博客种类与博客
  blogTypeModel.hasMany(blogModel, {
    foreignKey: "categoryId",
    targetKey: "id",
  });
  blogModel.belongsTo(blogTypeModel, {
    foreignKey: "categoryId",
    targetKey: "id",
    as: "category",
  });

  //关联评论与博客
  blogModel.hasMany(messageModel, { foreignKey: "blogId", targetKey: "id" });
  messageModel.belongsTo(blogModel, {
    foreignKey: "blogId",
    targetKey: "id",
    as: "blog",
  });

  //将数据模型和表进行同步
  await sequelize.sync({ alter: true });

  //一些表需要初始化数据
  //管理员
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
  //首页标语
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
  //全局设置
  const settingCount = await settingModel.count();
  if (!settingCount) {
    //表为空
    await settingModel.create({
      avatar: "http://www.duyiedu.com/source/img/logo.png",
      siteTitle: "个人空间",
      github: "gitub",
      qq: "123456",
      qqQrCode:
        "http://www.duyiedu.com/source/img/%E5%B0%8F%E6%B8%A1%E5%BE%AE%E4%BF%A1%E4%BA%8C%E7%BB%B4%E7%A0%81.png",
      weixin: "123456",
      weixinQrCode:
        "http://www.duyiedu.com/source/img/%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.png",
      mail: "123456@qq.com",
      icp: "黑ICP备17001719号",
      githubName: "gitubname",
      favicon: "http://mdrs.yuanjin.tech/Fs4CDlC6mwe_WXLMIiXcmSJLHO4f",
    });
    console.log("初始化全局设置数据完毕");
  }
  //关于页面
  const aboutCount = await aboutModel.count();
  if (!aboutCount) {
    //表为空
    await aboutModel.create({
      url: "https://www.aboutme.com",
    });
    console.log("初始化关于页面数据完毕");
  }
  console.log("数据库数据准备完毕");
})();
