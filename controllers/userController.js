// Require User Model
const { User } = require('../models');

const userController = {

    // Create a new User
    createUser({body}, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    // Get All Users
    getAllUsers(req, res) {
        User.find({})
        // populate users thoughts
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            // populate user friends
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .sort({_id: -1})
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Get single user by ID
    getUserById({params}, res) {
        User.findOne({_id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            // return if no user is found
            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({message: 'No User with this particular ID!'});
                    return;
                }
                res.json(dbUsersData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    // Update a current User by ID
    updateUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({message: 'No User with this particular ID!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err))
    },
   
    // delete a user with ID
    deleteUser({params}, res) {
        User.findOneAndDelete({_id: params.id})
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({message: 'No User with this particular ID!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // add a friend
    addFriend({params}, res) {
        User.findOneAndUpdate({_id: params.id}, {$push: { friends: params.friendId}}, {new: true})
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No User with this particular ID!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // Delete a current Friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate({_id: params.id}, {$pull: { friends: params.friendId}}, {new: true})
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({message: 'No User with this particular ID!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    }

};

module.exports = userController;