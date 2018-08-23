import { Document, Model, model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  username: String
});

userSchema.path('username').set(username => username.toUpperCase());

export interface User extends Document {
  username: string;
}

export const userModel: Model<User> = model<User>('User', userSchema);
