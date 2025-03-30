const express = require('express');
const verifyFirebaseToken = require('../middlewares/auth');
const { authentificateUser, refreshUser, addMobil, addCard, selectPaymentMethod, removeMobil, removeCard, addCoins, editProfil, getPosts, getDefaultParams } = require('../controllers/api');

const router = express.Router();

//users auth and refresh
router.post('/users/authentificate', verifyFirebaseToken, authentificateUser);
router.post('/users/refresh', verifyFirebaseToken, refreshUser);
    // default settings
    router.post('/settings/get-default-params', verifyFirebaseToken, getDefaultParams);
    //user
    router.post('/users/edit-profil', verifyFirebaseToken, editProfil);
    router.post('/users/add-mobil', verifyFirebaseToken, addMobil);
    router.post('/users/add-card', verifyFirebaseToken, addCard);
    router.post('/users/select-payement-method', verifyFirebaseToken, selectPaymentMethod);
    router.post('/users/remove-mobil', verifyFirebaseToken, removeMobil);
    router.post('/users/remove-card', verifyFirebaseToken, removeCard);
    router.post('/users/add-coins', verifyFirebaseToken, addCoins);
    //apartments
    router.post('/apartments/get-apartments', verifyFirebaseToken, getPosts);

module.exports = router;
