import { Document, Model, model, Schema } from 'mongoose';

const authenticationSchema: Schema = new Schema({
  username: String,
  hash: String
});

authenticationSchema.path('username').set(username => username.toUpperCase());

export interface Authentication extends Document {
  username: string;
  hash: string;
}

export const authenticationModel: Model<Authentication> = model<Authentication>('Authentication', authenticationSchema);
