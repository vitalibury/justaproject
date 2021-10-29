import User from "../models/User.js";
import errorHandler from "../utils/errorHandler.js";

export const registration = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    res.status(409).json({
      status: 409,
      message:
        "The user with such email have already exist. Login please.",
    });
  } else {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      errorHandler(res, err);
    }
  }
};

export const login = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    candidate.password === req.body.password
      ? res.status(200).json(candidate)
      : res.status(401).json({
          message: "Invalid password. Enter correct please.",
        });
  } else {
    res.status(404).json({
      status: 404,
      message: 'Such user does not exist. Register please.'
    })
  }
};
