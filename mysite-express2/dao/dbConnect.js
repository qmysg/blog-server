//链接数据库
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mysite2", "root", "@9527", {
  host: "localhost",
  dialect: "mysql",
  logger: false,
});

(async function () {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
