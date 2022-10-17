const adminModel = require("./model/adminModel");

module.exports.loginDao = async function (loginInfo) {
  return await adminModel.findOne({
    where: {
      loginId: loginInfo.loginId,
      loginPwd: loginInfo.loginPwd,
    },
  });
};
