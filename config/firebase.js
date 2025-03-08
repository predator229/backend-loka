const admin = require('firebase-admin');
const serviceAccount = require('../loka-damien-firebase-adminsdk-yplk2-7a3aa628fa.json'); // À créer

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
  
module.exports = admin;
