// backend/scripts/populateDB.js
require('dotenv').config(); // Load environment variables from .env
const axios = require('axios'); // For HTTP requests
const xml2js = require('xml2js'); // For XML parsing
const mongoose = require('mongoose');
const Programme = require('../models/ProgrammeSchema');
const Venue = require('../models/VenueSchema');

/**
 * Connects to the MongoDB database using the MONGO_URI from .env.
 * 
 * @function connectDB
 * @returns {Promise<void>} - Resolves when the database connection is established
 */
const connectDB = async () => {
    try {
        const dbUri = process.env.MONGO_URI; // Use the MONGO_URI from .env
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected to: ${dbUri}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

/**
 * Downloads XML content from a given URL.
 * 
 * @function fetchXML
 * @param {string} url - URL to fetch XML content from
 * @returns {Promise<string>} - The XML content as a string
 */
const fetchXML = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data; // Return XML data as string
    } catch (error) {
        console.error(`Error fetching XML from ${url}:`, error.message);
        throw error;
    }
};

/**
 * Parses XML content and converts it to a JavaScript object.
 * 
 * @function parseXML
 * @param {string} xmlContent - XML content as a string
 * @returns {Promise<Object>} - Parsed XML as a JavaScript object
 */
const parseXML = async (xmlContent) => {
    try {
        const parser = new xml2js.Parser();
        return await parser.parseStringPromise(xmlContent);
    } catch (error) {
        console.error('Error parsing XML:', error.message);
        throw error;
    }
};

/**
 * Upserts data into the Programme collection and marks missing IDs as deleted.
 * Existing likes and comments are preserved.
 * 
 * @function upsertProgrammes
 * @param {Array} programmes - Array of programme objects
 * @returns {Promise<void>}
 */
const upsertProgrammes = async (programmes) => {
    const newProgrammeIds = programmes.map(p => p.event_id);

    // Upsert new data
    for (const programme of programmes) {
        const existingProgramme = await Programme.findOne({ event_id: programme.event_id });
        if (existingProgramme) {
            // Preserve likes and comments, do not override
            programme.likes = existingProgramme.likes || 0;
            programme.comments = existingProgramme.comments || [];
        } else {
            // For new programmes, ensure likes and comments are initialized
            programme.likes = 0;
            programme.comments = [];
        }
        await Programme.findOneAndUpdate(
            { event_id: programme.event_id },
            programme,
            { upsert: true, new: true }
        );
    }

    // Mark old programmes as deleted
    await Programme.updateMany(
        { event_id: { $nin: newProgrammeIds } }, // Programmes not in the new dataset
        { deleted: true }
    );
    console.log('Programmes upserted and old ones marked as deleted.');
};

/**
 * Upserts data into the Venue collection and marks missing IDs as deleted.
 * 
 * @function upsertVenues
 * @param {Array} venues - Array of venue objects
 * @returns {Promise<void>}
 */
const upsertVenues = async (venues) => {
    const newVenueIds = venues.map(v => v.venue_id);

    // Upsert new data
    for (const venue of venues) {
        await Venue.findOneAndUpdate(
            { venue_id: venue.venue_id },
            venue,
            { upsert: true, new: true }
        );
    }

    // Mark old venues as deleted
    await Venue.updateMany(
        { venue_id: { $nin: newVenueIds } }, // Venues not in the new dataset
        { deleted: true }
    );
    console.log('Venues upserted and old ones marked as deleted.');
};

/**
 * Updates the event count for each venue.
 * 
 * @function updateVenueEventCounts
 * @returns {Promise<void>}
 */
const updateVenueEventCounts = async () => {
    console.log('Updating venue event counts...');
    const venues = await Venue.find({});
    for (const venue of venues) {
        const eventCount = await Programme.countDocuments({ venue_id: venue.venue_id });
        await Venue.findOneAndUpdate(
            { venue_id: venue.venue_id },
            { eventCount: eventCount },
            { new: true }
        );
    }
    console.log('Venue event counts updated.');
};

/**
 * Populates the database with programme and venue data from online XML files.
 * 
 * @function populateDB
 * @returns {Promise<void>} - Resolves when the database is populated
 */
const populateDB = async () => {
    try {
        await connectDB();

        // URLs of the XML files
        const eventXMLUrl = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml';
        const venueXMLUrl = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml';

        // Fetch and parse programmes
        console.log('Fetching event data...');
        const eventXMLContent = await fetchXML(eventXMLUrl);
        const eventXML = await parseXML(eventXMLContent);
        const programmes = eventXML.events.event.map(event => ({
            event_id: event.$.id,
            title: event.titlee[0],
            venue_id: event.venueid[0],
            dateline: event.predateE[0],
            duration: event.progtimee[0],
            price: event.pricee[0],
            description: event.desce[0],
            presenter: event.presenterorge[0],
            type: event.typee ? event.typee[0] : null,
            languages: event.languagee ? [event.languagee[0]] : [],
            remarks: event.remarkC ? event.remarkC[0] : null,
            eventUrl: event.tagenturle ? event.tagenturle[0] : null,
            enquiry: event.enquiry ? event.enquiry[0] : null,
            submitdate: new Date(),
        }));

        await upsertProgrammes(programmes);

        // Fetch and parse venues
        console.log('Fetching venue data...');
        const venueXMLContent = await fetchXML(venueXMLUrl);
        const venueXML = await parseXML(venueXMLContent);
        const venues = venueXML.venues.venue.map(venue => ({
            venue_id: venue.$.id,
            name: venue.venuee[0],
            description: venue.venuec[0],
            coordinates: {
                latitude: venue.latitude && venue.latitude[0] ? parseFloat(venue.latitude[0]) : null,
                longitude: venue.longitude && venue.longitude[0] ? parseFloat(venue.longitude[0]) : null,
            },
            eventCount: 0, // Initialize with 0
        }));

        await upsertVenues(venues);
        await updateVenueEventCounts();

        mongoose.connection.close();
        console.log('Database population completed.');
    } catch (error) {
        console.error('Error populating database:', error.message);
        process.exit(1); // Exit process with failure
    }
};


// Execute populateDB only if this script is run directly
if (require.main === module) {
    populateDB();
}

// Export populateDB function for external use
module.exports = populateDB;