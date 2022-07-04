import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from './routes/userRouter.js'
import postsRouter from './routes/postsRouter.js'


dotenv.config();

//Servidor
const app = express();
app.use(json());
app.use(cors());
const PORT = process.env.PORT;


app.use(userRouter);
app.use(postsRouter);


app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`)
});