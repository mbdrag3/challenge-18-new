const { Schema, model} = require('mongoose');

const reactionSchema = new Schema (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
        },
        reactionBody: {
            type: String,
            required: true,
            max_length: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => timeStamp(date)
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            max_length: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => timeStamp(date)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ reactionSchema ]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

thoughtSchema.virtual('reactionCount').get(function (){
    return this.reactions.length;
});

const Thought = model('thoughts', thoughtSchema);

module.exports = Thought;