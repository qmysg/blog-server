var express = require("express");
var router = express.Router();
const {
  addBlogTypeService,
  findAllBlogTypeService,
  findBlogTypeService,
  updateBlogTypeService,
  deleteBlogTypeService,
} = require("../service/blogTypeService");

//获取文章分类
router.get("/", async function (req, res, next) {
  res.send(await findAllBlogTypeService());
});

//添加文章分类
router.post("/", async function (req, res, next) {
  res.send(await addBlogTypeService(req.body));
});

//获取一个文章分类
router.get("/:id", async function (req, res, next) {
  res.send(await findBlogTypeService(req.params.id));
});

//修改一个文章分类
router.put("/:id", async function (req, res, next) {
  res.send(await updateBlogTypeService(req.body, req.params.id));
});

//删除一个文章分类
router.delete("/:id", async function (req, res, next) {
  res.send(await deleteBlogTypeService(req.params.id));
});

module.exports = router;
