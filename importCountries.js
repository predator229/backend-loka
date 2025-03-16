require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const Country = require('./models/Country');
const TypeUser = require('./models/TypeUser');

async function importData() {
    try {
        mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log('✅ ...'))
            .catch(err => console.error('❌ ... :', err));

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

importData();
