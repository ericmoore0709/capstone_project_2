const express = require('express');
const Profile = require('../models/profile');
const jsonschema = require('jsonschema');
const newProfileSchema = require('../schemas/profileNew.json');
const updateProfileSchema = require('../schemas/profileUpdate.json');
const { BadRequestError, NotFoundError } = require('../../expressError');
const User = require('../models/user');
const router = express.Router();


/** POST / - Create a new profile */
router.post('/', async (req, res, next) => {
    // get the user ID
    const user_id = +req.body.user_id;

    try {
        // pass new schema
        const validator = jsonschema.validate({ user_id }, newProfileSchema);

        if (!validator.valid) {
            const errors = validator.errors.map(e => e.message);
            throw new BadRequestError(errors);
        }

        // attempt to persist
        const result = await Profile.create(user_id);

        // get the user and append
        const profileUser = await User.getById(user_id);
        result.user = profileUser;

        // return result
        return res.status(201).json({ profile: result });
    } catch (err) {
        // handle error
        return next(err);
    }
});

/** GET /:user_id - Get profile by user ID */
router.get('/:user_id', async (req, res, next) => {
    // get the user ID
    const { user_id } = req.params;

    try {
        // attempt to retrieve profile
        const result = await Profile.findByUserId(+user_id);

        // get the user and append
        const profileUser = await User.getById(user_id);
        result.user = profileUser;

        // return result
        return res.status(200).json({ profile: result });
    } catch (err) {
        // handle error
        return next(err);
    }
});

/** PATCH /:user_id - Update profile bio by user ID */
router.patch('/:user_id', async (req, res, next) => {
    // get the user ID
    const user_id = +req.params.user_id;
    const { bio } = req.body;

    try {
        // pass new schema
        const validator = jsonschema.validate({ user_id, bio }, updateProfileSchema);

        if (!validator.valid) {
            const errors = validator.errors.map(e => e.message);
            throw new BadRequestError(errors);
        }

        // attempt to update
        const result = await Profile.update({ userId: user_id, bio });

        // get the user and append
        const profileUser = await User.getById(user_id);
        result.user = profileUser;

        // return result
        return res.status(200).json({ profile: result });
    } catch (err) {
        // handle error
        return next(err);
    }
});

/** DELETE /:user_id - Remove profile from user ID */
router.delete('/:user_id', async (req, res, next) => {
    // get the user ID
    const { user_id } = req.body;

    try {
        // attempt to delete
        const result = await Profile.delete(+user_id);

        // get the user and append
        const profileUser = await User.getById(user_id);
        result.user = profileUser;

        // return result
        return res.status(200).json({ profile: result });
    } catch (err) {
        // handle error
        return next(err);
    }
});

module.exports = router;