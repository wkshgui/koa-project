const Router = require("@koa/router");
const router = new Router();

const userController = require("../controller/userController");

router.get("/:userId", userController.index);

module.exports = router;