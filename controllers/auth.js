const getUserInfoByUUID = require('../tools/flutter_tools');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const User = require('../models/User');
const Uid = require('../models/Uid');
const Country = require('../models/Country');
const Mobil = require('../models/Mobil');
const Card = require('../models/Card');
const SelectedPayement = require('../models/SelectedPayement');

const authentificateUser = async (req, res) => {
    try {
        const { uid } = req.body;
        var the_user = await getTheCurrentUserOrFailed(req, res);
        if (!the_user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userResponse = await generateUserResponse(the_user);

        res.status(200).json({ user: userResponse, message: 'User found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addMobil = async (req, res) => {
    try {
        const { uid, mobil } = req.body;
        var the_user = await getTheCurrentUserOrFailed(req, res);
        if (!the_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (mobil){
            const mobil_ = new  Mobil();
            mobil_.digits = mobil.digits;
            mobil_.indicatif = mobil.indicatif;
            mobil_.title = mobil.title;
            await mobil_.save();

            the_user.mobils.push(mobil_._id);
            await the_user.save();

            the_user = await User.findOne({_id: the_user._id}) 
                .populate('country')
                .populate('selectedPayementMethod')
                .populate('cards')
                .populate('mobils');
        }
        const userResponse = await generateUserResponse(the_user);

        res.status(200).json({ user: userResponse, message: 'User found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addCard = async (req, res) => {
    try {
        const { uid, card } = req.body;

        var the_user = await getTheCurrentUserOrFailed(req, res);
        if (!the_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (card){
            const card_ = new  Card();
            card_.digits = card.digits;
            card_.expiration = card.expiration;
            card_.title = card.title;
            card_.cvv = card.cvv;
            await card_.save();

            the_user.cards.push(card_._id);
            await the_user.save();

            the_user = await User.findOne({_id: the_user._id}) 
                .populate('country')
                .populate('selectedPayementMethod')
                .populate('cards')
                .populate('mobils');
        }
        const userResponse = await generateUserResponse(the_user);

        res.status(200).json({ user: userResponse, message: 'User found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeMobil = async (req, res) => {
    try {
        const { uid, mobil } = req.body;

        var the_user = await getTheCurrentUserOrFailed(req, res);
        if (!the_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (mobil){
            const mobil_ = await Mobil.findOne({ _id: mobil.id });
            if (mobil_){
                the_user.mobils = the_user.mobils.filter((k, v) => k != mobil.id);
                if (the_user.selectedPayementMethod && the_user.selectedPayementMethod.mobil == mobil.id){
                    var theSelectedPayementMethod = await SelectedPayement.findOne({ _id: the_user.selectedPayementMethod });
                    await SelectedPayement.deleteOne(theSelectedPayementMethod);
                    the_user.selectedPayementMethod = null;
                }
                await the_user.save();
                await Mobil.deleteOne(mobil_);
            }

            the_user = await User.findOne({_id: the_user._id}) 
                .populate('country')
                .populate('selectedPayementMethod')
                .populate('mobils')
                .populate('cards');
        }
        const userResponse = await generateUserResponse(the_user);

        res.status(200).json({ user: userResponse, message: 'User found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeCard = async (req, res) => {
    try {
        const { uid, card } = req.body;

        var the_user = await getTheCurrentUserOrFailed(req, res);
        if (!the_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (card){
            const card_ = await Card.findOne({ _id: card.id });
            if (card_){
                the_user.cards = the_user.cards.filter((k, v) => k != card.id);
                if (the_user.selectedPayementMethod && the_user.selectedPayementMethod.card == card.id){
                    var theSelectedPayementMethod = await SelectedPayement.findOne({ _id: the_user.selectedPayementMethod });
                    await SelectedPayement.deleteOne(theSelectedPayementMethod);
                    the_user.selectedPayementMethod = null;
                }

                await the_user.save();
                await Card.deleteOne(card_);
            }

            the_user = await User.findOne({_id: the_user._id}) 
                .populate('country')
                .populate('selectedPayementMethod')
                .populate('mobils')
                .populate('cards');
        }
        const userResponse = await generateUserResponse(the_user);

        res.status(200).json({ user: userResponse, message: 'User found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const refreshUser = async (req, res) => {
    const { authkey, uid } = req.body;
    
    if (authkey !== "awebifu abwiofebu 4gt1p9p891ht bw45iugt9w") {
        return res.status(403).json({ message: 'Not authorized!' });
    }
    
    try {
        var uidObj = await Uid.findOne({ uid: uid });

        var the_user = uidObj ? await User.findOne({ uids: uidObj }) 
            .populate('country')
            .populate('selectedPayementMethod')
            .populate('cards')
            .populate('mobils') : false;

        var isNewUser = !the_user;

        var result = await getUserInfoByUUID(uid);

        if (result.status !== 200) {
            return res.status(404).json({ message: 'User not found' });
        }

        the_user = result.user.phoneNumber ? await User.findOne({ phone: result.user.phoneNumber }) 
            .populate('country')
            .populate('selectedPayementMethod')
            .populate('cards')
            .populate('mobils') : false;
        
        if (!the_user && result.user.email) {
            the_user = await User.findOne({ email: result.user.email })
                                                .populate('country')
                                                .populate('selectedPayementMethod')
                                                .populate('cards')
                                                .populate('mobils')
        }

        if(the_user) { isNewUser = false;}

        if (isNewUser) { the_user = new User(); }
        const phoneNumber = result.user.phoneNumber ? parsePhoneNumberFromString(result.user.phoneNumber) : false;
    
        if (phoneNumber) {
            const country = await Country.findOne({ code: phoneNumber.country });
            if (country) {
                the_user.country = country._id;
                the_user.phone = phoneNumber.nationalNumber;
            }
        }

        if (!uidObj){
            uidObj = new Uid({ uid: uid });
            await uidObj.save();
        }
        the_user.uids = the_user.uids ? the_user.uids.concat(uidObj._id) : [uidObj._id];
        // res.json(result);

        ['email', 'name', 'photoURL', 'disabled'].forEach(element => {
            the_user[element] = result.user[element];
        });
        if (result.user.displayName) { 
            let name = result.user.displayName.split(' ');
            the_user.name = name[0] ?? '';
            the_user.surname = name.filter((k, v) => v != 0).toString() ?? '';
        }
        the_user.role = 'user';
        the_user.coins = 5000;
        // the_user.role = 'seller';
        // the_user.role = 'admin';

        if (!isNewUser) { the_user.updatedAt = Date.now(); }

        await the_user.save();

        res.status(200).json({ user: the_user, message: 'User refreshed with updated data!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const selectPaymentMethod = async (req, res) => {
    try {
        const { uid, selectedPayement } = req.body;

        var the_user = await getTheCurrentUserOrFailed(req, res);
        if (!the_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (selectedPayement){
            const selectedPayement_ = new  SelectedPayement();
            selectedPayement_.mobil = selectedPayement.mobil;

            if (selectedPayement.mobil && selectedPayement.mobil.id){
                var mobil = await Mobil.findOne({ _id: selectedPayement.mobil.id });
                if (mobil){
                    selectedPayement_.mobil = mobil._id;
                }
            }else if (selectedPayement.card && selectedPayement.card.id){
                var card = await Card.findOne({ _id: selectedPayement.card.id });
                if (card){
                    selectedPayement_.card = card._id;
                }
            }
            if (selectedPayement_.mobil || selectedPayement_.card){
                await selectedPayement_.save();

                if (the_user.selectedPayementMethod){
                    var oldOne = await SelectedPayement.findOne({ _id: the_user.selectedPayementMethod });
                    if (oldOne){
                        await SelectedPayement.deleteOne(oldOne);
                    }
                }
                the_user.selectedPayementMethod = selectedPayement_._id;
                await the_user.save();
            }

            the_user = await User.findOne({_id: the_user._id}) 
                .populate('country')
                .populate('selectedPayementMethod')
                .populate('cards')
                .populate('mobils');
        }
        const userResponse = await generateUserResponse(the_user);

        res.status(200).json({ user: userResponse, message: 'User found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//commons fucntions
async function getTheCurrentUserOrFailed(req, res){
    const { uid, addMobil } = req.body;
    var uidObj = await Uid.findOne({ uid: uid });

    let the_user = uidObj ? await User.findOne({ uids: uidObj }) 
        .populate('country')
        .populate('selectedPayementMethod')
        .populate('cards')
        .populate('mobils') : false;

    if (!the_user) {
        const result = await getUserInfoByUUID(uid);
        if (result.status !== 200) {
            return res.status(404).json({ message: 'User not found' });
        }

        the_user = result.user.phoneNumber ? await User.findOne({ phone: result.user.phoneNumber }) 
            .populate('country')
            .populate('selectedPayementMethod')
            .populate('cards')
            .populate('mobils') : false;
        
        if (!the_user && result.user.email) {
            the_user = await User.findOne({ email: result.user.email })
                                .populate('country')
                                .populate('selectedPayementMethod')
                                .populate('cards')
                                .populate('mobils')
        }

        const phoneNumber = result.user.phoneNumber ? parsePhoneNumberFromString(result.user.phoneNumber) : false;

        if (!uidObj){
            uidObj = new Uid({ uid: uid });
            await uidObj.save();
        }

        if (!the_user) {
            the_user = new User({
                uid: [uidObj],
                email: result.user.email,
                name: result.user.name,
                photoURL: result.user.photoURL,
                phone: result.user.phone ?? '',
                disabled: result.user.disabled,
                coins: 5000,
            });
            the_user = await User.findOne({ uids: uid }) 
                .populate('country')
                .populate('selectedPayementMethod')
                .populate('cards')
                .populate('mobils');
        }
        else{
            the_user.uid.push(uidObj);
        }
        await the_user.save();
        the_user.new_user =  1;


        if (phoneNumber) {
            const country = await Country.findOne({ code: phoneNumber.country });
            if (country) {
                the_user.country = country._id;
                the_user.phone = phoneNumber.nationalNumber;
            }
        }
    }
    return the_user;
}
async function generateUserResponse(user){
    if (user.selectedPayementMethod) {
        const result = await SelectedPayement.findOne({ _id: user.selectedPayementMethod._id })
            .populate('mobil')
            .populate('card');

        if (result.mobil == null) { delete result.mobil; }
        if (result.card == null) { delete result.card; }

        user.selectedPayementMethod = result;
    }

    return {
        _id: user._id,
        email: user.email,
        country: user.country ? user.country : null,
        phone: user.phone ?? '',
        name: user.name ?? '',
        surname: user.surname ?? '',
        imgPath: user.photoURL ?? (user.name ? `https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=random` : 'https://ui-avatars.com/api/?size=500&background=random'),
        typeUser: user.role,
        role: user.role,
        coins: user.coins ?? 0,
        selectedPayementMethod: user.selectedPayementMethod,
        // {
        //     mobil: user.selectedPayementMethod.mobil ? {
        //         id: user.selectedPayementMethod.mobil._id,
        //         digits: user.selectedPayementMethod.mobil.digits,
        //         indicatif: user.selectedPayementMethod.mobil.indicatif,
        //         title: user.selectedPayementMethod.mobil.title
        //     } : null,
        //     card: user.selectedPayementMethod.card ? {
        //         id: user.selectedPayementMethod.card._id,
        //         digits: user.selectedPayementMethod.card.digits,
        //         expiration: user.selectedPayementMethod.card.expiration,
        //         title: user.selectedPayementMethod.card.title,
        //         cvv: user.selectedPayementMethod.card.cvv
        //     } : null,
        // } : null,
        cards: user.cards,
        mobils: user.mobils,
    };
}

//exports
module.exports = { authentificateUser, refreshUser, addMobil, addCard, selectPaymentMethod, removeMobil, removeCard };
