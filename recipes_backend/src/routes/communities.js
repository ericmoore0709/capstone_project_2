const express = require('express');
const jsonschema = require('jsonschema');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../../expressError');
const { ensureLoggedIn } = require('../middleware/auth');
// const Community = require('../models/community');
// const User = require('../models/user');
const newCommunitySchema = require('../schemas/communityNew.json');
const updateCommunitySchema = require('../schemas/communityUpdate.json');
const User = require('../models/user');
const Community = require('../models/community');
const router = express.Router();

/**
 * POST / - Create a new community
 */
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, newCommunitySchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const community = await Community.create(req.body);

        const admin = await User.getById(community.adminId);
        community.admin = admin;

        return res.status(201).json({ community });
    } catch (err) {
        return next(err);
    }
});

/**
 *  GET / - Retrieve all communities
 */
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const communities = await Community.findAll();

        await Promise.all(communities.map(async (community) => {
            const admin = await User.getById(community.adminId);
            community.admin = admin;
        }));

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
        const community = await Community.findById(req.params.id);

        const admin = await User.getById(community.adminId);
        community.admin = admin;

        return res.status(200).json({ community });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /user/:user_id - Retrieve communities by user ID
 */
router.get('/user/:user_id', ensureLoggedIn, async (req, res, next) => {
    try {
        const communities = await Community.findByUserId(req.params.user_id);
        return res.status(200).json({ communities });
    } catch (err) {
        return next(err);
    }
});

/**
 * PATCH /:id - Update a community
 */
router.patch('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, updateCommunitySchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }

        const community = await Community.findById(req.params.id);
        if (community.adminId !== res.locals.user.id)
            throw new ForbiddenError('You do not have permission to access this resource.');

        const updatedCommunity = await Community.update(req.params.id, req.body);

        const admin = await User.getById(updatedCommunity.adminId);
        updatedCommunity.admin = admin;

        return res.status(200).json({ community: updatedCommunity });
    } catch (err) {
        return next(err);
    }
});

/**
 * DELETE /:id - Delete a community
 */
router.delete('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        const community = await Community.findById(req.params.id);
        if (community.adminId !== res.locals.user.id)
            throw new ForbiddenError('You do not have permission to access this resource.');

        await Community.remove(req.params.id);

        return res.status(200).json({ success: true });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;