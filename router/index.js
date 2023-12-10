const Router = require("@koa/router");
const router = new Router({prefix: "/api/v1"});

router.use("/user", require("./user").routes());
router.use("/video", require("./video").routes());

module.exports = router;