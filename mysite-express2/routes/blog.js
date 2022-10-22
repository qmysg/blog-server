var express = require("express");
var router = express.Router();
const {
  addBlogService,
  findBlogService,
  findOneBlogService,
  updateBlogService,
  deleteBlogService,
} = require("../service/blogService");

//分页获取文章
router.get("/", async function (req, res, next) {
  res.send(await findBlogService(req.query));
});

//添加文章
router.post("/", async function (req, res, next) {
  res.send(await addBlogService(req.body));
});

//获取一个文章
router.get("/:id", async function (req, res, next) {
  res.send(await findOneBlogService(req.params.id, req.headers.authorization));
});

//修改一个文章
router.put("/:id", async function (req, res, next) {
  res.send(await updateBlogService(req.params.id, req.body));
});

//删除一个文章
router.delete("/:id", async function (req, res, next) {
  res.send(await deleteBlogService(req.params.id));
});

module.exports = router;
