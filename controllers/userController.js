import dotenv from "dotenv";
import joi from "joi";
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid'
import {db} from '../database/mongoDB.js'

dotenv.config();

//Sing-up
export async function createUser (req, res){

    const usuario = req.body;
    const usuarioSchema = joi.object(
        {
            name: joi.string().required(),
            email: joi.string().required(),
            password: joi.string().required(),
            passwordValid: joi.ref('password')
        }
    )

    const usedEmail = await db.collection('cadastros').findOne({email: usuario.email});

    if(usedEmail){
        return res.status(409).send("Email já cadastrado");
    }

    const {error} = usuarioSchema.validate(usuario);
    if (error){
        return res.sendStatus(422);
    }

    const passwordHash = bcrypt.hashSync(usuario.password, 10);

    await db.collection('cadastros').insertOne({ ...usuario, password: passwordHash });

    res.status(201).send('Usuário criado');
};

//Sing-in
export async function loginUser (req, res){
    const usuario = req.body;

    const usuarioSchema = joi.object(
        {
            email: joi.string().required(),
            password: joi.string().required()
        }
    )
    
    const {error} = usuarioSchema.validate(usuario);
    if (error){
        return res.sendStatus(422);
    }

    const user = await db.collection('cadastros').findOne({email: usuario.email});
    const passwordVerify = bcrypt.compareSync(usuario.password, user.password);

    if (user && passwordVerify) {

        const token = uuid();

        await db.collection('sessions').insertOne({ token, userId: user._id });

        return res.status(201).send({token, name: user.name});
    } else {
        return res.status(401).send('Senha ou usuário inválidos');
    }
};

//Sing-out
export async function singOut (req, res){

    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if(!token) return res.send(404);
    
    try {
      await db.collection("sessions").deleteOne({token});
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
};