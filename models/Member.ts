import mongoose, { Document, Schema } from 'mongoose';

export interface IMember extends Document {
    name: string;
    email: string;
    image_url: string;
    public_id: string;
}

const MemberSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    image_url: { type: String, required: true },
    public_id: { type: String, required: true },
}, { timestamps: true }); // Add timestamps if you want createdAt and updatedAt fields

const Members = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export { Members };