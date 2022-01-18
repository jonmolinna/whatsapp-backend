import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        trim: true,
    },
    from: String,
    to: String,
    status: {
        type: Boolean,
        default: true,
    },
    private: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
    versionKey: false,
});

export default mongoose.model('Message', messageSchema);