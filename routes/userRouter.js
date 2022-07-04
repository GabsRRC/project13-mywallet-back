import { createUser, loginUser, singOut } from '../controllers/userController.js';
import { Router } from 'express'

const router = Router()

//Sing-up
router.post("/cadastro", createUser);

//Sing-in
router.post("/login", loginUser);

//Sing-out
router.get("/singout", singOut);

export default router;