const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");

//关于页面
module.exports = sequelize.define(
  "about",
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);
