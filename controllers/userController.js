const { User, Thoughts } = require('../models')

module.exports = {

    //Get Users
    async getUsers (req, res) {
        try {
          const users = await User.find()
          .select('-__v');

          res.json(users);

        } catch (err) {
            console.log(`GET MULTIPLE USERS ERROR: ${err}`);
            return res.status(500).json(err);
        }
      },

      //Get a single User by ID
      async getSingleUser (req,res) {
        try {
            const user = await User.findOne({ _id: req.params.userId})
            .select('-__v')
            .populate('thoughts')
            .populate('friends');

            if (!user) {
                return res.status(404).json({ message: "No student matching that ID"})
            }
            res.json(user);

        } catch (err) {
            console.log(`GET SINGLE ERROR: ${err}`);
            return res.status(500).json(err);
        }
      },

      // Updating user based on ID
      async updateSingleUser (req,res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId},
                { $set: req.body},
                { new: true, runValidators: true}
            )
            .select('-__v')
            .populate('thoughts')
            .populate('friends');

            if (!user) {
                return res.status(404).json({ message: "No user matching that ID that can be updated."})
            }
            res.json(user);
        } catch (err) {
            console.log(`UPDATING USER ERROR: ${err}`);
            return res.status(500).json(err)
        }
      },

      // Create a User
      async createUser (req,res) {
        try {
            const user = await User.create(req.body)
            res.json(user)
        } catch (err) {
            console.log(`CREATE USER ERROR: ${err}`);
            res.status(500).json(err)
        }
      },

      // Add friend to User
      async addFriend (req,res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId},
                { $addToSet: { friends: req.params.friendId} },
                { new: true }
            )
            .select('-__v')
            .populate('thoughts')
            .populate('friends');

            if (!user) {
                return res.status(404).json({ message: "No User found with that ID that we can add to friends."})
            }
            res.json(user);

        } catch (err) {
            console.log(`ADD TO FRIEND ERROR: ${err}`);
            return res.status(500).json(err)
        }
      },

      async deleteFriend (req,res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId},
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )
            .select('-__v')
            .populate('thoughts')
            .populate('friends')

            if (!user) {
                return res.status(404).json({ message: "No User with that ID that is currently your friend that can be removed."})
            }
            res.json(user);

        } catch (err) {
            console.log(`REMOVE FRIEND ERROR: ${err}`);
            return res.status(500).json(err)
        }
      }
}