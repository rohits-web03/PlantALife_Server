import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {plantTree} from "../controllers/tree.controller.js";

const router=Router()

router.route("/new").post(upload.fields([
    {
        name: "plantImage",
        maxCount: 1
    }
]),plantTree);

export default router;