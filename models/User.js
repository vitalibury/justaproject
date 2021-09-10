import mongoose from 'mongoose'

const Schema = mongoose.Schema

const defaultBool = {
  type: Boolean,
  default: null
}

const defaultStr = {
  type: String,
  default: ''
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  country: defaultStr,
  male: defaultBool,
  female: defaultBool,
  birthDate: {
    type: Date,
    default: null
  },
  avatar: defaultStr,
  interests: {
    dancing: defaultBool,
    design: defaultBool,
    languages: defaultBool,
    sport: defaultBool,
    technics: defaultBool,
    travels: defaultBool
  }
});

export default mongoose.model('users', userSchema);
