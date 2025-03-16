require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises; // Utilisation de la version `Promise` de fs
const Country = require('./models/Country');
const TypeUser = require('./models/TypeUser');

// Fonction principale d'import
async function importData() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected...');

        // Lire et parser le fichier JSON des pays
        const data = await fs.readFile('countries.json', 'utf8');
        const countries = JSON.parse(data);

        // Insérer les pays dans la base de données
        await Country.insertMany(countries);
        console.log('🌍 Countries data has been added to the database!');

        // Insertion des types d'utilisateur
        const typesUser = [
            { title: 'Propriétaire', description: 'Propriétaire de compte' },
            { title: 'Compte client', description: 'Propriétaire de d\'appartement' },
            { title: 'Administrateur', description: 'Administrateur de Loka' }
        ];

        await TypeUser.insertMany(typesUser);
        console.log('👥 User types have been added to the database!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        // Fermer la connexion proprement
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed.');
    }
}

// Exécuter l'importation
importData();
