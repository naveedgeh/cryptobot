import mongoose, { Schema, Document } from 'mongoose';

interface ISecretPhrase extends Document {
  secretPhrase: string;
  createdAt: Date;
}

const secretPhraseSchema = new Schema<ISecretPhrase>({
  secretPhrase: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SecretPhrase = mongoose.models.SecretPhrase || mongoose.model<ISecretPhrase>('SecretPhrase', secretPhraseSchema);

export default SecretPhrase;
