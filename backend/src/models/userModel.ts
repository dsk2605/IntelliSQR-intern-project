import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';


export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;  
  name: string;
  email: string;
  password: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true, 
  }
);


userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;