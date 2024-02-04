import { Router } from "express";
import { addTransaction } from "../controllers/transaction.controller.js";

const router=Router()

router.route("/new").post(addTransaction);

export default router;