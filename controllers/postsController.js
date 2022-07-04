import dotenv from "dotenv";
import joi from "joi";
import dayjs from "dayjs";

import {db, objectId} from '../database/mongoDB.js'


dotenv.config();

//Get registros
export async function getRegistros (req, res) {
      const posts = res.locals.posts;
      res.send(posts);
  };

//Post registros
export async function createRegistros (req, res){
      const post = req.body;
      const { authorization } = req.headers;
      const token = authorization?.replace('Bearer ', '');
    
      const postSchema = joi.object({
        value: joi.number().required(),
        type: joi.string().valid("entrada", "saida").required(),
        description: joi.string().required(),
        day: dayjs().format('DD/MM')
      });
    
      const { error } = postSchema.validate(post);
    
      if (error) {
        return res.sendStatus(422);
      }
      
      const session = await db.collection('sessions').findOne({ token });
    
      if (!session) {
        return res.sendStatus(401);
      }
    
      await db.collection('registros').insertOne({ ...post, userId: session.userId });
      res.status(201).send('Registro criado com sucesso');
  };
  
  