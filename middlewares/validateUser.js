import {db, objectId} from '../database/mongoDB.js'

async function validadeUser(req, res, next){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const session = await db.collection('sessions').findOne({ token });
  
    if (!session) {
      return res.sendStatus(401);
    }
  
    const posts = await db
      .collection('registros')
      .find({ userId: new objectId(session.userId) })
      .toArray();

    res.locals.posts = posts;

      next();
}

export default validadeUser;