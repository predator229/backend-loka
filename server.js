require('dotenv').config();

require('./models/Card');
require('./models/SelectedPayement');
require('./models/User');
require('./models/Mobil');
require('./models/TypeUser');
require('./models/UserAuthentificate');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Country = require('./models/Country');
const TypeUser = require('./models/TypeUser');

const fs = require('fs').promises;

const usersRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
app.use(helmet());


// Connexion à MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected bien chien la'))
//     .catch(err => console.log(err));
async function importData() {
    try {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ MongoDB connecté avec succès'))
        .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

        console.log('🗑️ Suppression de toutes les collections...');
        const collections = await mongoose.connection.db.collections();
            
        for (let collection of collections) {
            await collection.deleteMany({});
        }

        const data = await fs.readFile('countries.json', 'utf8');
        const countries = JSON.parse(data);

        await Country.insertMany(countries);
        console.log('🌍 Countries data has been added to the database!');

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
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed.');
    }
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connecté avec succès'))
    .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

importData();
// Routes protégées par Firebase Auth
app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(mongoose.modelNames());
});
