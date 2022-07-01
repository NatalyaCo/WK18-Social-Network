const router = require('express').Router();

const {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller');

// new school way
router.route("/").get(getAllUser).post(createUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;

// router
//   .route('/')
//   .get(getAllUser)
//   .post(createUser);


// router
//   .route('/:id')
//   .get(getUserById)
//   .put(updateUser)
//   .delete(deleteUser);

// router
//   .route('/:userId/friends/:friendId')
//   .post(addFriend)
//   .delete(deleteFriend);

//is this a better way?