import express from "express";
import { UserController } from "../handler/userController";

const router = express.Router()

//Auth router
router.post('/register', UserController.signUp)
router.post('/login', UserController.signIn)

export default router;