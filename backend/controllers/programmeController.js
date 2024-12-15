// backend/controllers/programmeController.js

const Programme = require('../models/ProgrammeSchema');
const { generateDebugInfo } = require('../utils/debugUtils');

// A map to store cooldown timers for likes
const userLikeCooldown = new Map(); // Map<programmeId-userId, timestamp>

/**
 * Retrieves all programmes with populated venue details.
 *
 * @function getAllProgrammes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with all programmes or an error message.
 */
const getAllProgrammes = async (req, res) => {
    try {
        const programmes = await Programme.find().populate('venue', 'venue_id name coordinates');
        res.status(200).json({
            code: 'GET_ALL_PROGRAMMES_SUCCESS',
            message: 'Programmes retrieved successfully',
            data: programmes,
        });
    } catch (error) {
        console.error('Error fetching programmes:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Retrieves a programme by its event_id with populated venue details.
 *
 * @function getProgrammeById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a JSON response with the programme data or an error message.
 */
const getProgrammeById = async (req, res) => {
    try {
        const programme = await Programme.findOne({ event_id: req.params.id }).populate(
            'venue',
            'venue_id name coordinates'
        );

        if (!programme) {
            return res.status(404).json({
                code: 'PROGRAMME_NOT_FOUND',
                message: 'Programme not found',
                data: null,
            });
        }

        res.status(200).json({
            code: 'GET_PROGRAMME_SUCCESS',
            message: 'Programme retrieved successfully',
            data: programme,
        });
    } catch (error) {
        console.error('Error fetching programme:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            data: {
                error: generateDebugInfo(error),
            },
        });
    }
};

/**
 * Creates a new programme (Admin Only).
 *
 * @function createProgramme
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a JSON response with the created programme or an error message.
 */
const createProgramme = async (req, res) => {
    try {
        const programme = new Programme(req.body);
        const savedProgramme = await programme.save();
        res.status(201).json({
            code: 'CREATE_PROGRAMME_SUCCESS',
            message: 'Programme created successfully',
            data: savedProgramme,
        });
    } catch (error) {
        console.error('Error creating programme:', error.message);
        res.status(400).json({
            code: 'CREATE_PROGRAMME_ERROR',
            message: 'Error creating programme',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Updates a programme by its event_id (Admin Only).
 *
 * @function updateProgrammeById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a JSON response with the updated programme or an error message.
 */
const updateProgrammeById = async (req, res) => {
    try {
        const updatedProgramme = await Programme.findOneAndUpdate(
            { event_id: req.params.id },
            req.body,
            { new: true }
        );

        if (!updatedProgramme) {
            return res.status(404).json({
                code: 'PROGRAMME_NOT_FOUND',
                message: 'Programme not found',
                debug: generateDebugInfo(new Error('Programme not found')),
            });
        }

        res.status(200).json({
            code: 'UPDATE_PROGRAMME_SUCCESS',
            message: 'Programme updated successfully',
            data: updatedProgramme,
        });
    } catch (error) {
        console.error('Error updating programme:', error.message);
        res.status(400).json({
            code: 'UPDATE_PROGRAMME_ERROR',
            message: 'Error updating programme',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Deletes a programme by its event_id (Admin Only).
 *
 * @function deleteProgrammeById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a JSON response indicating success or an error message.
 */
const deleteProgrammeById = async (req, res) => {
    try {
        const deletedProgramme = await Programme.findOneAndDelete({ event_id: req.params.id });

        if (!deletedProgramme) {
            return res.status(404).json({
                code: 'PROGRAMME_NOT_FOUND',
                message: 'Programme not found',
                data: null,
            });
        }

        res.status(200).json({
            code: 'DELETE_PROGRAMME_SUCCESS',
            message: 'Programme deleted successfully',
            data: null,
        });
    } catch (error) {
        console.error('Error deleting programme:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            data: {
                error: generateDebugInfo(error),
            },
        });
    }
};

/**
 * Like a programme by its event_id with rate-limiting (one like per minute).
 *
 * @function likeProgramme
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a JSON response indicating success or an error message.
 */
const likeProgramme = async (req, res) => {
    try {
        const programmeEventId = req.params.id; // Use event_id from request params
        const userId = req.user?.id || 'guest'; // Fallback for unauthenticated users

        const cooldownKey = `${programmeEventId}-${userId}`;
        const lastLikeTime = userLikeCooldown.get(cooldownKey);
        const currentTime = Date.now();
        const cooldownPeriod = 30000; // 30sec cooldown in milliseconds

        if (lastLikeTime && currentTime - lastLikeTime < cooldownPeriod) {
            const remainingTime = Math.ceil((cooldownPeriod - (currentTime - lastLikeTime)) / 1000);
            return res.status(429).json({
                code: 'LIKE_RATE_LIMITED',
                message: `Please wait ${remainingTime} seconds before liking again.`,
                data: {
                    cooldown: remainingTime,
                },
            });
        }

        const programme = await Programme.findOne({ event_id: programmeEventId });
        if (!programme) {
            return res.status(404).json({
                code: 'PROGRAMME_NOT_FOUND',
                message: 'Programme not found',
                data: null,
            });
        }

        programme.likes += 1;
        await programme.save();

        userLikeCooldown.set(cooldownKey, currentTime);

        res.status(200).json({
            code: 'PROGRAMME_LIKED_SUCCESS',
            message: 'Programme liked successfully',
            data: {
                likes: programme.likes,
            },
        });
    } catch (error) {
        console.error('Error liking programme:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            data: {
                error: generateDebugInfo(error),
            },
        });
    }
};

/**
 * Comment on a programme by its event_id.
 *
 * @function commentOnProgramme
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a JSON response indicating success or an error message.
 */
const commentOnProgramme = async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json({
                code: 'COMMENT_REQUIRED',
                message: 'Comment is required',
            });
        }

        const programme = await Programme.findOne({ event_id: req.params.id });
        if (!programme) {
            return res.status(404).json({
                code: 'PROGRAMME_NOT_FOUND',
                message: 'Programme not found',
                debug: generateDebugInfo(new Error('Programme not found')),
            });
        }

        programme.comments.push(comment);
        await programme.save();

        res.status(200).json({
            code: 'COMMENT_ADDED_SUCCESS',
            message: 'Comment added successfully',
            data: programme,
        });
    } catch (error) {
        console.error('Error commenting on programme:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

module.exports = {
    getAllProgrammes,
    getProgrammeById,
    createProgramme,
    updateProgrammeById,
    deleteProgrammeById,
    likeProgramme,
    commentOnProgramme,
};
