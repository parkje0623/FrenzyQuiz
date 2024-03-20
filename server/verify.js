const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
    const header = req.headers['authorization'];
  
    if (typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];
  
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; 
        next();
      } catch (e) {
        console.error('Error verifying token', e);
        res.status(403).send('Unauthorized');
      }
    } else {
      //If header is undefined return Unauthorized(403)
      res.sendStatus(403)
    }
  }

  module.exports = { verifyToken }