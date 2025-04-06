import { ROLES } from '#constants';
import { Schema } from '#lib';
import bcrypt from 'bcryptjs';
import crypto, { verify } from 'crypto';
import { type } from 'os';

const User = new Schema({
  name: 'User',
  schema: [
    {
      username: {
        type: String,
        required: [true, 'Username is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
      },
      role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.CUSTOMER,
      },
      info: {
        type: Schema.Types.ObjectId,
        ref: 'UserInfo',
        default: null,
      },

      resetPassword: {
        token: String,
        expire: Date,
      },
      verifyEmail: {
        token: String,
        expire: Date,
      },
      otp: {
        code: Number,
        expire: Date,
      },
      emailVerifiedAt: {
        type: Date,
        default: null,
      },
      fcmToken: {
        type: String,
        default: null,
      },
      provider: {
        type: String,
        default: null,
      }
    },
    { timestamps: true },
  ],
});

User.statics.fillables = ['username', 'email', 'password', 'fcmToken', 'role', 'emailVerifiedAt', 'info'];
User.statics.hidden = [
  '__v',
  'password',
  'resetPassword',
  'verifyEmail',
  'otp',
  // 'fcmToken',
];

User.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

User.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPassword.token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPassword.expire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return this.resetPassword;
};

User.methods.getVerifyEmailToken = function () {
  const verifyToken = crypto.randomBytes(20).toString('hex');
  this.verifyEmail.token = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');
  this.verifyEmail.expire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return this.verifyEmail;
};

User.methods.getOTP = function () {
  this.otp.code = Math.floor(100000 + Math.random() * 900000);
  this.otp.expire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return this.otp;
};

User.pre('save', async function (next) {
  if (this.isModified('password'))
    this.password = await this.hashPassword(this.password);
  if (this.isModified('email') && this.emailVerifiedAt)
    this.emailVerifiedAt = null;
  if (this.isModified('email') && this.verifyEmail.token) this.verifyEmail = {};
  if (this.isModified('email') && this.otp.code) this.otp = {};
  next();
});

User.pre('delete', async function (next) {
  const user = this;
  await user.model('UserInfo').deleteOne({ user: user._id });
  next();
});



export default User.makeModel();
