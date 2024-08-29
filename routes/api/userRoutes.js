const router = require('express').Router();

const {
    getUsers,
    getSingleUser,
    updateSingleUser,
    createUser,
    addFriend,
    deleteFriend
} = require('../../controllers/userController')

router.route('/').get(getUsers).post(createUser);

router.route('/:userId').get(getSingleUser).put(updateSingleUser)

router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend)

module.exports = router;