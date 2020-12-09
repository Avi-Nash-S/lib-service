const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  userRegisterValidation,
  userLoginValidation,
} = require("../middlewares/user.middleware");
let User = require("../models/user.model");

// Signup endpoint
router.route("/register").post(async (req, res) => {
  // validate the request body
  const { error } = userRegisterValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashPassword;
  // add user
  const user = new User(req.body);
  // save user in DB
  user
    .save()
    .then((user) =>
      res.status(200).json({
        accessToken: jwt.sign(
          { _id: user._id },
          process.env.ACCESS_TOKEN_SECRET
        ),
        _id: user.id,
      })
    )
    .catch((err) => res.status(400).json({ error: err }));
});

// Login endpoint
router.route("/login").post(async (req, res) => {
  // validate the request body
  const { error } = userLoginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  // check the req for email/userName for login
  const userExists = req.body.userEmail
    ? await User.findOne({ userEmail: req.body.userEmail })
    : await User.findOne({ userName: req.body.userName });
  // validate user
  if (!userExists) return res.status(400).json("User details are not valid");
  // validate user password
  const validatePassword = bcrypt.compareSync(
    req.body.password,
    userExists.password
  );
  if (!validatePassword) return res.status(400).json("Password is not valid");
  // generate user specific jwt token
  const token = jwt.sign(
    { _id: userExists._id },
    process.env.ACCESS_TOKEN_SECRET
  );
  // return token and userId
  return res.status(200).json({ accessToken: token, _id: userExists._id });
});

// Specific user endpoint
router.route("/:id").get((req, res) =>
  User.findById(req.params.id)
    .then((user) => {
      let userApi = { ...user._doc };
      delete userApi.password;
      res.json(userApi);
    })
    .catch((err) => res.status(400).json("Error: " + err))
);

module.exports = router;
