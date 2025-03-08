require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');
const Country = require('./models/Country');
const TypeUser = require('./models/TypeUser');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('MongoDB Connected...');
}).catch(err => {
  console.log('MongoDB connection error:', err);
});

// Lire le fichier JSON
// fs.readFile('countries.json', 'utf8', async (err, data) => {
//   if (err) {
//     console.log('Erreur lors de la lecture du fichier JSON', err);
//     return;
//   }

//   // Parser le contenu JSON
//   const countries = JSON.parse(data);

//   // Insérer les pays dans la base de données
//   try {
//     await Country.insertMany(countries);
//     console.log('Countries data has been added to the database!');
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   } finally {
//     // Fermer la connexion à MongoDB après l'insertion
//     mongoose.connection.close();
//   }
// });


// var typesUser = [
//     { title: 'Propriétaire', description: 'Propriétaire de compte'},
//     { title: 'Compte client', description: 'Propriétaire de d\'apartement'} ,
//     { title: 'Administrateur', description: 'Administarateur de de loka'}
// ];
// typesUser.forEach(element => {
//     var saveindb = new TypeUser();
//     saveindb.title = element.title;
//     saveindb.description = element.description
//     saveindb.save()

//     console.log("gata");
// });
console.log(TypeUser.find({}));

mongoose.connection.close();
