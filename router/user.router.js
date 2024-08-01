import express from "express";
const router = express.Router();

import {
  postLogin,
  postSignup,
  postUpdate,
  postDelete
} from "../controller/user.controller.js";
import verify from "../utils/verify.js";

console.log("start");
router.post("/signup", postSignup);
router.post("/login", postLogin);
router.post("/update/:id", verify, postUpdate);
router.delete("/delete/:id", verify, postDelete);

export default router;
