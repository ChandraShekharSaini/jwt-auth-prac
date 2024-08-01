import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";

export const postSignup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  try {
    const hashPassword = bcrypt.hashSync(password, 10);
    let user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(200).json({
      message: "User created successfully",
      User: user,
    });
  } catch (error) {
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    console.log("ValidUser", validUser);

    if (!validUser) return next(errorHandler(401, "Unauthorized"));

    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(401, "Invalid Credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    validUser.token = token;
    await validUser.save();

    console.log("900");
    const { password: pass, ...rset } = validUser._doc;

    res.cookie("access_token", token, { https: true }).status(200).json(rset);
  } catch (error) {
    next(error);
  }
};

export const postUpdate = async (req, res, next) => {
  console.log(req.params.id);
  console.log(req.user.id);
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You do not have permission to"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const postDelete = async (req, res, next) => {
    console.log(process.env)
  if (req.user.id != req.params.id) {
    return next(errorHandler(401, "You do not have permission to"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error)
  }
};
