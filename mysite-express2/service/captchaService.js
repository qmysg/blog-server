const svgCaptcha = require("svg-captcha");

module.exports = async function () {
  return await svgCaptcha.create({
    size: 4,
    color: true,
    noise: 6,
    ignoreChars: "lI10oOi",
  });
};
