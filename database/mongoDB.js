import {MongoClient, ObjectId} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

//Banco de dados
const mongoClient = new MongoClient(process.env.MONGO);
let db;
const promise = mongoClient.connect();
promise.then(() => {
    db = mongoClient.db(process.env.BANCO);
    console.log("Database conectado")
});
promise.catch((e) => console.log("Erro na conexão com database", e));

const objectId = ObjectId;

export {db, objectId};