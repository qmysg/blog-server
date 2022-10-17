const md5 = require("md5");
const { loginDao } = require("../dao/adminDao");
//处理登录逻辑
module.exports.loginService = async function (loginInfo) {
  loginInfo.loginPwd = md5(loginInfo.loginPwd);

  const data = await loginDao(loginInfo);
  if (data && data.dataValues) {
    //添加token
  }
  return { data };
};
