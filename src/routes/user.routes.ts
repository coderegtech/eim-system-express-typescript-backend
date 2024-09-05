import { Router } from "express";
import { createUser, loginUser } from "../controller/auth.controller";

const router = Router();

router.post("/createUser", createUser);
router.post("/login", loginUser);

export default router;
