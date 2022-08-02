const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw new Error('All fields are required');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password is not strong enough. Must contain at least 1 number, 1 uppercase letter and 1 special character'
    );
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error('Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  // validation
  if (!email || !password) {
    throw new Error('All fields are required');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Invalid email');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
