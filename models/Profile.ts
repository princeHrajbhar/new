import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    skill: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    profileImage: { type: String, required: true },
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);