import userData from './user.js';

function getMessage(user) {
    const selected = userData.users.filter((item => {
        return item.name == user;
    }))[0];


    return selected.message;
};

module.exports = {
    getMessage
};