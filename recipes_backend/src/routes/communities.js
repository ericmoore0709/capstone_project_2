const express = require('express');
const jsonschema = require('jsonschema');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../../expressError');
const { ensureLoggedIn } = require('../middleware/auth');
// const Community = require('../models/community');
// const User = require('../models/user');
// const newCommunitySchema = require('../schemas/newCommunity.json');
const router = express.Router();

/**
 * POST / - Create a new community
 */
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        // const validator = jsonschema.validate(req.body, newCommunitySchema);
        // if (!validator.valid) {
        //     const errors = validator.errors.map(e => e.message);
        //     throw new BadRequestError(errors);
        // }
        // const community = await Community.create({ ...req.body, adminId: res.locals.user
        const community = {
            ...req.body,
            adminId: res.locals.user.id
        }
        return res.status(201).json({ community: community });
    } catch (err) {
        return next(err);
    }
});

/**
 *  GET / - Retrieve all communities
 */
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        // const communities = await Community.findAll();
        const communities = [
            { id: 1, name: "Sample Community 1", description: "This is a sample community.", adminId: 1 },
            { id: 2, name: "Sample Community 2", description: "This is another sample community.", adminId: 2 }
        ];
        return res.status(200).json({ communities });
    } catch (err) {
        return next(err);
    }
});

/** 
 * GET /:id - Retrieve a community by ID
 */
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        // const community = await Community.findById(req.params.id);
        const community = { id: req.params.id, name: "Sample Community", adminId: 1 };
        if (!community) throw new NotFoundError(`Community not found: ${req.params.id}`);
        // if (community.adminId !== res.locals.user.id)
        //     throw new ForbiddenError('You do not have permission to access this resource.');
        return res.status(200).json({ community });
    } catch (err) {
        return next(err);
    }
});

router.get('/user/:user_id', ensureLoggedIn, async (req, res, next) => {
    try {
        // const communities = await Community.findByUserId(req.params.user_id);
        const communities = [
            { id: 1, name: "Sample Community 1", description: "This is a sample community.", adminId: req.params.user_id },
            { id: 2, name: "Sample Community 2", description: "This is another sample community.", adminId: req.params.user_id }
        ];
        return res.status(200).json({ communities });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;