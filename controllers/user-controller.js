const {
    User,
    Thought
} = require("../models");

const userController = {
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .sort({
                _id: -1
            })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getUserById({
        params
    }, res) {
        User.findOne({
                _id: params.id
            })
            .populate({
                path: "thoughts",
                select: "-__v",
            })
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res
                        .status(404)
                        .json({
                            message: "No user found with this id!"
                        });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    createUser({
        body
    }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err));
    },

    updateUser({
        params,
        body
    }, res) {
        User.findOneAndUpdate({
                _id: params.id
            }, body, {
                new: true,
                runValidators: true,
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: "No user found with this id!"
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    deleteUser({
        params
    }, res) {
        User.findOneAndDelete({
                _id: params.id
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({
                        message: "No user with this id!"
                    });
                }
            
                return Thought.deleteMany({
                    _id: {
                        $in: dbUserData.thoughts
                    }
                });
            })
            .then(() => {
                res.json({
                    message: "User and associated thoughts deleted!"
                });
            })
            .catch((err) => res.json(err));
    },

    addFriend({
        params
    }, res) {
        User.findOneAndUpdate({
                _id: params.userId
            }, {
                $addToSet: {
                    friends: params.friendId
                }
            }, {
                new: true,
                runValidators: true
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: "No user with this id"
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    removeFriend({
        params
    }, res) {
        User.findOneAndUpdate({
                _id: params.userId
            }, {
                $pull: {
                    friends: params.friendId
                }
            }, {
                new: true
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({
                        message: "No user with this id!"
                    });
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
};
module.exports = userController;