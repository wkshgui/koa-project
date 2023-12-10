const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../util/jwt");

const vodController = require("../controller/vodController");
const videoController = require("../controller/videoController");

router.get("/getvod", verifyToken(true), vodController.getvod);
router.get("/getvodplay", vodController.getPlay);
router.post("/createvideo", verifyToken(true), videoController.createVideo);
router.get("/videolist/:userid", videoController.videoList);
router.get("/getvideo/:userid", videoController.getVideo);

router.post("/comment/:videoid", verifyToken(true), videoController.createComment);

module.exports = router;