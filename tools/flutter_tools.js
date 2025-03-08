const admin = require('../config/firebase');

const getUserInfoByUUID = async (uuid) => {
    try {
        const userRecord = await admin.auth().getUser(uuid);
        return { status: 200, user: userRecord };
    } catch (error) {
        return { status: 404, message: 'User not found', error: error.message };
    }
};
module.exports = getUserInfoByUUID;
