import mongoose, { Schema, Document } from 'mongoose';

export interface IFart extends Document {
  name: string;
  fileName: string;
  fileUrl: string;
  uploader: string;
  uploadDate: Date;
  likes: number;
  dislikes: number;
  voters: {
    walletAddress: string;
    vote: 'like' | 'dislike';
  }[];
}

const FartSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  uploader: {
    type: String,
    required: true,
    index: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  voters: [{
    walletAddress: {
      type: String,
      required: true,
    },
    vote: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  }],
});

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Fart || mongoose.model<IFart>('Fart', FartSchema);
