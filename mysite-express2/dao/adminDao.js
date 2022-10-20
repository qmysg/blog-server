const adminModel = require("./model/adminModel");

//登录信息
module.exports.loginDao = async function (loginInfo) {
  return await adminModel.findOne({
    where: {
      loginId: loginInfo.loginId,
      loginPwd: loginInfo.loginPwd,
    },
  });
};

//修改信息
module.exports.updateAdminDao = async function (accountInfo) {
  return await adminModel.update(accountInfo, {
    where: {
      loginId: accountInfo.loginId,
    },
  });
};
