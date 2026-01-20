const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
      select: false,
    },
    passwordChangedAt: { type: Date, select: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: { type: Boolean, default: true, select: false },
    failedLogin: { type: Number, default: 0, select: false },
    maxLoginAttempts: { type: Number, default: 5, select: false },
    nextLoginDate: { type: Date },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.incrementFailedLogin = async function () {
  this.failedLogin += 1;
  if ((this.failedLogin >= this.maxLoginAttempts)) {
    this.nextLoginDate = Date.now() + 30 * 60 * 1000; // 30 دقيقة
  }
  console.log(this.failedLogin, this.nextLoginDate);
  await User.findByIdAndUpdate(this._id, this);
};

userSchema.methods.isLocked = function () {
  return this.nextLoginDate && this.nextLoginDate > Date.now();
};
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
