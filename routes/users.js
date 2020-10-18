const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// @route   POST api/users/
// @desc    Create a new user
// @access  Private
router.post(
    "/",
    [
        check("name", "Please enter your name").not().isEmpty(),
        check("email", "Please enter a valid email address").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res
                    .status(400)
                    .send("Email already registered. Please update it and try again...");
            }

            user = new User({
                name,
                email,
                password,
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            res.send(err.message);
        }
    }
);

// @route   PUT api/users/
// @desc    Update current user name and password
// @access  Private
router.put(
    "/",
    [
        auth,
        [
            check("name", "Please enter your name").not().isEmpty().optional(),
            check("password", "Password must be at least 6 characters")
                .isLength({
                    min: 6,
                })
                .optional(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, password } = req.body;

        const userUpdateFields = {};
        if (name) userUpdateFields.name = name;
        if (password) {
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            userUpdateFields.password = await bcrypt.hash(password, salt);
        }

        try {
            let user = await User.findByIdAndUpdate(req.user.id, {
                $set: userUpdateFields,
            });

            res.json({ msg: "Contact updated!" });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error...");
        }
    }
);

// @route   GET api/users
// @desc    Get all the users
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ date: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
