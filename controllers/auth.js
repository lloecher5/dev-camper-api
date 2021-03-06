const { restart } = require("nodemon");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

//@desc Register user
//@route GETs /api/v1/auth/register
//@access Public
exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
};

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password"), 400);
  }

  //Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials"), 401);
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials"), 401);
  }

  //Get token from model, create cookie and send response
  const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 10000
      ),
      httpOnly: true,
    };

    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, token });
  };

  sendTokenResponse(user, 200, res);
};

//@desc Get current logged in user
//@route POST /api/v1/auth/me
//@access Private

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};
