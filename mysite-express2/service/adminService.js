const md5 = require("md5");
const { loginDao, updateAdminDao } = require("../dao/adminDao");
const jwt = require("jsonwebtoken");
const { ValidationError } = require("../utils/error");
const { formatResponse } = require("../utils/tool");
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

//处理修改账号
module.exports.updateAdminService = async function (accountInfo) {
  accountInfo.oldLoginPwd = md5(accountInfo.oldLoginPwd);
  const adminInfo = await loginDao({
    loginId: accountInfo.loginId,
    loginPwd: accountInfo.oldLoginPwd,
  });
  if (adminInfo && adminInfo.dataValues) {
    const newPassword = md5(accountInfo.loginPwd);
    await updateAdminDao({
      name: accountInfo.name,
      loginId: accountInfo.loginId,
      loginPwd: newPassword,
    });
    return formatResponse(0, "", {
      loginId: accountInfo.loginId,
      name: accountInfo.name,
      id: adminInfo.dataValues.id,
    });
  } else {
    throw new ValidationError("旧密码错误");
  }
};
