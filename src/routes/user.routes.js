import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, registerUser,logoutUser, updateSeeds, updateBalance } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { fetchUsersSortedByTreesPlanted } from "../controllers/user.controller.js";

const router=Router()

router.route("/signup").post(upload.fields([
    {
        name: "profileImage",
        maxCount: 1
    }
]),registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/updateSeeds/:userID").post(updateSeeds);

router.route("/updateBalance").post(updateBalance);

router.route("/sortByTreesPlanted").get(fetchUsersSortedByTreesPlanted);

export default router;