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
require('./models/ApartmentCard');
require('./models/Room');
require('./models/EquimentType');

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
const RoomType = require('./models/RoomType');
const ApartementEquipement = require('./models/ApartementEquipement');
const ServiceClosest = require('./models/ServiceClosest');

const fs = require('fs').promises;

const usersRoutes = require('./routes/api');
const Room = require('./models/Room');

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

        const typesApartements = [
            { icone: "view_comfortable_outlined", name: "Tous les logements"},
            { icone: "home_filled", name: "Chambre salon"},
            { icone: "home_work", name: "Appartement meublé"},
            { icone: "blinds_closed_outlined", name: "Imeubles a vendre"},
            { icone: "local_offer_rounded", name: "Imeubles a vendre"},
        ];

        await TypeApartment.insertMany(typesApartements);
        console.log('👥 Types apartemnts have been added to the database!');

        const rooms = [
            { icon: "bed_rounded", name: "Chambre", description : "Chambre a couche" },
            { icon: "chair", name: "Salon", description : "Salon" },
            // { icon: "kitchen_sharp", name: "Cuisine", description : "Cuisine separee" },
            // { icon: "outdoor_grill_sharp", name: "Terrase", description : "Terrasse donnant exterieur" },
            // { icon: "chair", name: "Salle de bain", description : "Salle de bain americaine" },
        ];

        await RoomType.insertMany(rooms);
        console.log('👥 Rooms types have been added to the database!');

        const equipementsType = [
            { icon: "tv", name: "TV", description : "TV 40" },
            { icon: "wallet_sharp", name: "Véranda", description : "Escalier sur deux etages" },
            { icon: "waterfall_chart_sharp", name: "Cuisine", description : "Véranda sur 40" },
            { icon: "panorama_wide_angle_select_sharp", name: "Plafond", description : "Plafond en bois massif" },
            { icon: "outdoor_grill_sharp", name: "Avec cour", description : "Avec cour" },
            { icon: "kitchen_sharp", name: "Cuisine", description : "Cuisine americaine" },
            { icon: "door_back_door", name: "Portail", description : "Portail blindé" },
            { icon: "sanitizer_outlined", name: "Toillettes", description : "Toillettes americaine" },
            { icon: "self_improvement", name: "Dégagement", description : "Dégagement" },
            { icon: "bathroom", name: "Salle de bain", description : "Toillettes americaine" },
            { icon: "gradient_rounded", name: "Jardin", description : "Jardin spatieux" },
        ];

        await EquimentType.insertMany(equipementsType);
        console.log('👥 EquipementType have been added to the database!');
    
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

async function generateApartments() {
    console.log("🛠️ Generating apartments...");
    const typeApartments = await TypeApartment.find();
    const equipmentTypes = await EquimentType.find();
    const roomsType = await RoomType.find();

    let apartments = [];
    for (let index = 0; index < 100; index++) {
        let images = Array.from({ length: 5 }, () => faker.image.url());
        var superfietotal = 0;
        let aparmtRooms = []; 
        if (roomsType) {
            for (let i = 0; i < faker.number.int({ min: 1, max: 10 }); i++) {
            var room_superficie = faker.number.int({ min: 20, max: 200 });
            superfietotal += room_superficie;
            let room = new Room({
                type: roomsType[faker.number.int({ min: 0, max: roomsType.length - 1 })]._id,
                moreinformation: faker.lorem.paragraph(),
                superficie: room_superficie.toString() + " m²",
            });
            aparmtRooms.push(room);
            }
            await Room.insertMany(aparmtRooms);
        }

        let apartmentsEquipmts = [];
        if (equipmentTypes) {
            for (let i = 0; i < faker.number.int({ min: 1, max: 10 }); i++) {
            let equip = new ApartementEquipement({
                type: equipmentTypes[faker.number.int({ min: 0, max: equipmentTypes.length - 1 })]._id,
                superficie: faker.number.int({ min: 20, max: 200 }).toString() + " m²",
                moreinformation: faker.lorem.paragraph(),
            });
            apartmentsEquipmts.push(equip);
            }
            await ApartementEquipement.insertMany(apartmentsEquipmts);
        }

        let services = [];
        for (let i = 0; i < faker.number.int({ min: 0, max: 10 }); i++) {
            let service = new ServiceClosest({
            name: faker.lorem.words(),
            description: faker.lorem.paragraph(),
            });
            services.push(service);
        }
        if (services.length > 0) { await ServiceClosest.insertMany(services); }

        const apartmentCaracteristique = new ApartmentCaracteristique({
            rooms: aparmtRooms.map(({ _id }) => _id),
            superficieTotale: superfietotal,
            equipements: apartmentsEquipmts.map(({ _id }) => _id),
            services: services.map(({ _id }) => _id),
        });

        await apartmentCaracteristique.save();

        // apartmentCaracteristique = await User.findOne({_id: apartmentCaracteristique._id}) 
        //     .populate('rooms')
        //     .populate('equipements')
        //     .populate('services');
        
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
            typeApartment: typeApartments.length
            ? [
                typeApartments[0]._id, // Le premier élément
                ...Array.from(
                  { length: Math.min(faker.number.int({ min: 1, max: 3 }), typeApartments.length - 1) }, // 1 à 3 éléments aléatoires
                  () => typeApartments[faker.number.int({ min: 1, max: typeApartments.length - 1 })]._id
                ),
              ]
            : [],
            nrColoc: faker.number.int({ min: 1, max: 5 }),
            nbrNeightbord: faker.number.int({ min: 1, max: 10 }),
            caracteristiques: apartmentCaracteristique._id,
        });

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
            console.log('📌 Modèles Mongoose chargés:', mongoose.modelNames());
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erreur de connexion MongoDB :', err);
        process.exit(1);
    });
