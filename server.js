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
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connecté avec succès'))
    .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

// Routes protégées par Firebase Auth
app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(mongoose.modelNames());
});
