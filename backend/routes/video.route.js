import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { compression, conversion, keyMoments, resizeVideoDimensions, splitVideos, stabilization } from "../controllers/video.controller.js";
import { analyzeText } from "../controllers/ai.controller.js";

const router = Router();

router.route("/keymoments").post(upload.single("media"), keyMoments);
router.route('/analyse').get(analyzeText);
router.route('/stabilization').post(upload.single("media"), stabilization);
router.route('/compression').post(upload.single("media"), compression);
router.route('/conversion').post(upload.single("media"), conversion);
router.route('/resizing').post(upload.single("media"), resizeVideoDimensions);
router.route('/split').post(upload.single("media"), splitVideos);

export default router;
