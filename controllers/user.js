import User from "../models/User.js";
import errorHandler from "../utils/errorHandler.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  try {
    res.status(200).json(users);
  } catch(e) {
    errorHandler(res, e);
  }
};

export const getUserByEmail = async (req, res) => {
  const user = await User.findOne({email: req.params.email});
  try {
    res.status(200).json(user);
  } catch(e) {
    errorHandler(e);
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOneAndUpdate(
    {email: req.params.email},
    {$set: req.body},
    {new: true}
    );
  try {
      res.status(200).json(user);
  } catch(e) {
    errorHandler(res, e);
  }
};

export const removeUser = async (req, res) => {
  try {
    await User.deleteOne({email: req.params.email});
    res.status(200).json({
      message: 'User has been deleted successfully.'
    })
  } catch(e) {
    errorHandler(res, e);
  }
};