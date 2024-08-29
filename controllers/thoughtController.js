const { User, Thoughts } = require('../models')

module.exports = {

    // Get all thoughts
    async getThoughts (req,res) {
        try {
            const thought = await Thoughts.find()
            .select('-__v');

            res.json(thought);
            
        } catch (err) {
            console.log(`GET MULTIPLE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },

    // Get a single thought by ID
    async getSingleThought (req,res) {
        try {
            const thought = await Thoughts.findOne({
                _id: req.params.thoughtId
            }).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: "No thought matching that ID"})
            }

            res.json(thought)

        } catch (err) {
            console.log(`GET SINGLE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },

    // Create a thought
    async createThought (req,res) {
        try {
            const thought = await Thoughts.create(req.body);

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId},
                { $push: { thoughts: thought._id}},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: "No User with that ID. Thought not created properly"})
            }

            res.status(201).json({ message: "Thought created and associated with user!", thought });

        } catch (err) {
            console.log(`CREATE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },
    
    // Update a thought by ID
    async updateThought (req,res) {
        try {
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $set: req.body },
                { runValidators: true, new: true}
            )
            if (!thought) {
                return res.status(404).json({ message: "Thought wasn't able to be updating due to incorrect ID"})
            }

            res.json(thought)

        } catch (err) {
            console.log(`UPDATE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },

    // Delete a thought by ID
    async deleteThought (req,res) {
        try {
            const thought = await Thoughts.findOneAndDelete(
                { _id: req.params.thoughtId}
            )

            if (!thought) {
                return res.status(404).json({ message: "Unable to delete thought due to invalid id"})
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId }},
                { new: true }
            )

            if (!user) {
                return res.status(404).json ({ message: "Thought deleted but doesnt belong to a user."})
            }
            
            res.json({ message: "Thought and user data updated"})

        } catch (err) {
            console.log(`DELETE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },

    async createReaction (req,res) {
        try {
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: {reactions: req.body} },
                { new: true, runValidators: true }
            )
            if (!thought) {
                return res.status(404).json({ message: "No thought found with that ID"})
            }
            res.json(thought);

        } catch (err) {
            console.log(`ADD REACTION ERROR: ${err}`);
            return res.status(500).json(err);
        }
    }, 

    async deleteReaction (req,res) {
        try {

            console.log(`Attempting to delete reaction with ID: ${req.params.reactionId} from thought with ID: ${req.params.thoughtId}`);
            
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: {reactions: { _id: req.params.reactionId } } },
                { new: true, runValidators: true }
            )
            if (!thought) {
                return res.status(404).json({ message: "No thought found with that ID"})
            }
            res.json(thought);

        } catch (err) {
            console.log(`DELETE REACTION ERROR: ${err}`);
            return res.status(500).json(err);
        }
    }
}