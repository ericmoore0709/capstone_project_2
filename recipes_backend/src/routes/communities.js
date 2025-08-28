const express = require('express');
const jsonschema = require('jsonschema');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../../expressError');
const { ensureLoggedIn } = require('../middleware/auth');
// const Community = require('../models/community');
// const User = require('../models/user');
// const newCommunitySchema = require('../schemas/newCommunity.json');
const router = express.Router();

const communities = [
    { id: 1, name: "Sample Community 1", description: "This is a sample community.", adminId: 1 },
    { id: 2, name: "Sample Community 2", description: "This is another sample community.", adminId: 2 }
];

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
            adminId: res.locals.user.id,
            id: communities.length + 1
        }
        communities.push(community);
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
        const community = communities.find(c => c.id === parseInt(req.params.id));
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
        const userId = parseInt(req.params.user_id);
        const userCommunities = communities.filter(c => c.adminId === userId);
        if (userId !== res.locals.user.id)
            throw new ForbiddenError('You do not have permission to access this resource.');

        return res.status(200).json({ communities: userCommunities });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;