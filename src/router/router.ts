import express from "express";
import { UserController } from "../handler/userController";
import { auth } from "../../shared/middleware/jwt";

const router = express.Router()

//Auth router
router.post('/register', UserController.signUp)
router.post('/login', UserController.signIn)
router.post("/logout", auth, UserController.logout);

export default router;