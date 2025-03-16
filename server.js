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
const { exec } = require('child_process');
const usersRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
app.use(helmet());

async function resetDatabase() {
    try {
        console.log('🗑️ Suppression de toutes les collections...');
        const collections = await mongoose.connection.db.collections();
        
        for (let collection of collections) {
            await collection.deleteMany({});
        }

        console.log('✅ Base de données vidée avec succès.');

        console.log('📥 Importation des pays...');
        exec('node importCountries.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Erreur lors de l'importation des pays : ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`⚠️ STDERR : ${stderr}`);
                return;
            }
            console.log(`📦 Importation terminée : ${stdout}`);

            app.listen(PORT, () => {
                console.log(`🌍 Server running on port ${PORT}`);
                console.log(mongoose.modelNames());
            });
        });

    } catch (error) {
        console.error('❌ Erreur lors du reset de la base de données :', error);
    }
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connecté avec succès');
        resetDatabase();
    })
    .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

app.use('/api/users', usersRoutes);
