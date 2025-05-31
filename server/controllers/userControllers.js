const HttpError = require("../models/errorModel");
const UserModel = require("../models/userModel"); // userModel are where we have all diffrent types of datatype or input
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const userModel = require("../models/userModel");

//============================ REGISTER USER
// POST: api/user/register
// UNPROTECTED

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return next(new HttpError("Fill in the all fields"));
    }

    // make the email lowercase
    const lowerCaseEmail = email.toLowerCase();

    // check DB if email already exist
    const emailExists = await UserModel.findOne({ email: lowerCaseEmail });

    if (emailExists) {
      return next(new HttpError("Email already exists", 422));
    }

    // IF password and confirm password match
    if (password !== confirmPassword) {
      return next(new HttpError("Passwords do not match", 422));
    }

    // Check password length
    if (password.length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters", 422)
      );
    }

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // add user to DB

    const newUser = await UserModel.create({
      fullName,
      email: lowerCaseEmail,
      password: hashedPassword,
    });

    res.json({newUser, 
        message: "Registered successfully",

    }).status(201);
    // res.json(" User Registered");
  } catch (error) {
    return next(new HttpError(error));
  }
};

//============================ LOGIN USER
// POST: api/user/login
// UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Fill in the all fields"));
    }

    // make email lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Fetch user from the DB
    const user = await UserModel.findOne({ email: lowerCaseEmail });

    if (!user) {
      return next(new HttpError("Invalid Credential", 422));
    }

    // const { uPassword, ...userInfo } = user;

    const comparedPass = await bcrypt.compare(password, user?.password);

    // Compare passwords
    if (!comparedPass) {
      return next(new HttpError("Invalid Credential", 422));
    }

    const token = await jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .json({
        token,
        id: user?._id,
        profilePhoto: user?.profilePhoto,
        message: "User login successfully",
        // success: true,
      })
      .status(200);
    // res.json({token, id: user?._id, ...userInfo}).status(200)
  } catch (error) {
    return next(new HttpError(error));
  }
};

//============================ GET USER
// GET: api/user/:id
// PROTECTED
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      return next(new HttpError("User not found"));
    }

    res.json(user).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//============================ GET USER
// GET: api/users
// PROTECTED
const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find().limit(10).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//============================ EDIT USERS
// PATH: api/users/edit
// PROTECTED
const editUser = async (req, res, next) => {
  try {
    const { fullName, bio } = req.body;
    const editedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      { fullName, bio },
      { new: true }
    );
    res.json(editedUser).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//============================ FOLLOW/UNFOLLOW USERS
// GET: api/users/:id/follow-unfollow
// PROTECTED
const followUnfollowUser = async (req, res, next) => {
  try {
    const userToFollowId = req.params.id;
    if (req.user.id == userToFollowId) {
      return next(new HttpError("You can't follow/unfollow yourself", 422));
    }

    const currentUser = await UserModel.findById(req.user.id);
    const isFollowing = currentUser?.following?.includes(userToFollowId);

    // Follow if not following, else unfollow if already following
    if (!isFollowing) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userToFollowId,
        { $push: { followers: req.user.id } },
        { new: true }
      );
      await UserModel.findByIdAndUpdate(
        req.user.id,
        {
          $push: { following: userToFollowId },
        },
        { new: true }
      );
      res.json(updatedUser);
    } else {
      {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userToFollowId,
          { $pull: { followers: req.user.id } },
          { new: true }
        );
        await UserModel.findByIdAndUpdate(
          req.user.id,
          {
            $pull: { following: userToFollowId },
          },
          { new: true }
        );
        res.json(updatedUser);
      }
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

//============================ CHANGE USER PROFILE PIC
// POST: api/users/avatar
// PROTECTED
const changeUserAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image", 422));
    }

    
    const { avatar } = req.files;
    // Check file sizee
    if (avatar.size > 500000) {
      return next(
        new HttpError(
          "Profile picture too big. SHould be less thatn 500kb",
          422
        )
      );
    }

    let fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
    
      avatar.mv(path.join(__dirname, "..", "uploads", newFilename), async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        // Store image on cloudinary
        const result = await cloudinary.uploader.upload(
          path.join(__dirname, "..", "uploads", newFilename),
          { resource_type: "image" }
        );
        if (!result.secure_url) {
          return next(
            new HttpError("Couldn't uploade image to cloudinary", 422)
          );
        }

        const updatedUser = await userModel.findByIdAndUpdate(
          req.user.id,
          { profilePhoto: result?.secure_url },
          { new: true }
        );

        res.json(updatedUser).status(200);
      }
    );

    // res.json(newFilename)
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
};
