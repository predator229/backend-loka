require('dotenv').config();

require('./models/Card');
require('./models/SelectedPayement');
require('./models/User');
require('./models/Mobil');
require('./models/TypeUser');
require('./models/UserAuthentificate');
require('./models/ApartementEquipement');
require('./models/ApartmentCaracteristique');
require('./models/TypeApartment');
require('./models/ServiceClosest');
require('./models/RoomType');
require('./models/JournalCard');
require('./models/EquimentType');
require('./models/ApartmentCard');
require('./models/Room');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Country = require('./models/Country');
const TypeUser = require('./models/TypeUser');
const { faker } = require('@faker-js/faker');
const ApartmentCard = require('./models/ApartmentCard');
const TypeApartment = require('./models/TypeApartment');
const EquimentType = require('./models/EquimentType');
const ApartmentCaracteristique = require('./models/ApartmentCaracteristique');

const fs = require('fs').promises;

const usersRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
app.use(helmet());

async function importData() {
    try {
        if (process.env.NODE_ENV !== 'production') {
            console.log('🗑️ Suppression de toutes les collections...');
            const collections = await mongoose.connection.db.listCollections().toArray();
            for (let collection of collections) {
                await mongoose.connection.db.collection(collection.name).deleteMany({});
            }
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
        process.exit(1);
    }
}

async function generateApartments() {
    console.log("🛠️ Generating apartments...");
    const typeApartments = await TypeApartment.find();
    const equipmentTypes = await EquimentType.find();

    let apartments = [];
    for (let index = 0; index < 100; index++) {
        let images = Array.from({ length: 5 }, () => faker.image.url());        
        let apartment = new ApartmentCard({
            imageUrl: images,
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            descriptionLocation: faker.location.streetAddress(),
            location: `${faker.location.city()}, ${faker.location.country()}`,
            date: faker.date.future(),
            price: faker.number.int({ min: 20000, max: 100000 }),
            rating: faker.number.float({ min: 1, max: 5 }),
            reviews: faker.number.int({ min: 10, max: 500 }),
            crownPoints: faker.number.int({ min: 10, max: 100 }),
            devise: "FCFA",
            perPeriod: "month",
            isFavourite: faker.datatype.boolean(),
            typeApartment: typeApartments.length ? [typeApartments[faker.number.int({ min: 0, max: typeApartments.length - 1 })]._id] : undefined,
            nrColoc: faker.number.int({ min: 1, max: 5 }),
            nbrNeightbord: faker.number.int({ min: 1, max: 10 }),
            caracteristiques: []
        });

        // let feature = new ApartmentCaracteristique({
        //     superficieTotale: `${faker.number.int({ min: 30, max: 150 })} m²`,
        //     equipment: equipmentTypes.map(e => e._id).filter(id => mongoose.Types.ObjectId.isValid(id)),
        //     services: [],
        //     rooms: [

        //     ]
        // });

        // await feature.save();
        // apartment.features.push(feature._id);
        // a ameliorer
        apartments.push(apartment);
    }
    await ApartmentCard.insertMany(apartments);
    console.log("✅ 100 apartments successfully generated!");
}

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connecté avec succès');
        await importData();
        await generateApartments();

        console.log('✅ Importation des données terminée.');
        app.use('/api', usersRoutes);

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log('📌 Modèles Mongoose chargés:', mongoose.modelNames());
        });
    })
    .catch(err => {
        console.error('❌ Erreur de connexion MongoDB :', err);
        process.exit(1);
    });
