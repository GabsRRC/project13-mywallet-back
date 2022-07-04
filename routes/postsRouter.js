import { getRegistros, createRegistros } from '../controllers/postsController.js';
import { Router } from 'express'
import validadeUser from '../middlewares/validateUser.js';

const router = Router();

//Get registros
router.get("/posts" , validadeUser, getRegistros);

//Post registros
 router.post("/posts", createRegistros);

 export default router;