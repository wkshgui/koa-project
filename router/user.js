const Router = require("@koa/router");
const router = new Router();
const { registerValidate, loginValidate } = require("../middleware/userValidate");
const { verifyToken } = require("../util/jwt");
const userController = require("../controller/userController");

// router.get("/:userId", userController.index);
router.post("/register", registerValidate, userController.register);
router.post("/login", loginValidate, userController.login);
router.get("/getuser/:userid", verifyToken(false), userController.getuser);
router.get("/subscribe/:subscribeid", verifyToken(true), userController.subscribe);
router.get("/subscribeList", verifyToken(true), userController.subscribeList);

module.exports = router;