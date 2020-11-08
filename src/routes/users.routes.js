const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userRegisterValidation, userLoginValidation } = require('../middlewares/user.middleware');
let User = require('../models/user.model');

router.route('/register').post(async (req, res) => {
    const { error } =  userRegisterValidation(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    const user = new User(req.body);
    user.save().then(user => res.status(200).json({ accessToken: jwt.sign({_id: user._id}, process.env.ACCESS_TOKEN_SECRET), _id: user.id })).catch(err => res.status(400).json({ error: err }));
});

router.route('/login').post( async (req, res) => {
    const { error } =  userLoginValidation(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});
    const userExists = req.body.userEmail ? await User.findOne({ userEmail: req.body.userEmail }) : await User.findOne({ userName: req.body.userName });
    if(!userExists) return res.status(400).json('User details are not valid');
    const validatePassword = bcrypt.compareSync(req.body.password, userExists.password);
    if(!validatePassword) return res.status(400).json('Password is not valid');
    const token = jwt.sign({_id: userExists._id}, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({ accessToken: token, _id: userExists._id });
});

router.route('/:id').get((req, res) => User.findById(req.params.id).then(user => {
    let userApi = {...user._doc};
    delete userApi.password;
    res.json(userApi)
}).catch(err => res.status(400).json('Error: ' + err)));


module.exports = router;