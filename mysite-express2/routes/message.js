var express = require("express");
var router = express.Router();
const {
  findMessageService,
  addMessageService,
  deleteMessageService,
} = require("../service/messageService");

//分页获取留言
router.get("/", async function (req, res, next) {
  res.send(await findMessageService(req.query));
});

//提交留言
router.post("/", async function (req, res, next) {
  res.send(await addMessageService(req.body));
});

//删除留言
router.delete("/:id", async function (req, res, next) {
  res.send(await deleteMessageService(req.params.id));
});

module.exports = router;
