const md5 = require("md5");
const { loginDao } = require("../dao/adminDao");
const jwt = require("jsonwebtoken");
//处理登录逻辑
module.exports.loginService = async function (loginInfo) {
  loginInfo.loginPwd = md5(loginInfo.loginPwd);

  let data = await loginDao(loginInfo);
  if (data && data.dataValues) {
    //添加token
    data = {
      id: data.dataValues.id,
      loginId: data.dataValues.loginId,
      name: data.dataValues.name,
    };
    //登录过期时间
    let loginPeriod = 1;
    if (loginInfo.remember) {
      loginPeriod = parseInt(loginInfo.remember);
    }
    const token = jwt.sign(data, md5(process.env.JWT_SECRET), {
      expiresIn: 60 * 60 * 24 * loginPeriod,
    });
    return {
      token,
      data,
    };
  }
  return { data };
};
