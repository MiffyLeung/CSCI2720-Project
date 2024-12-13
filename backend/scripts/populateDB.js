// backend/scripts/populateDB.js

require('dotenv').config(); // Load environment variables from .env
const fs = require('fs');
const xml2js = require('xml2js');
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
 * Parses an XML file and converts it to a JavaScript object.
 * 
 * @function parseXML
 * @param {string} filePath - Path to the XML file
 * @returns {Promise<Object>} - Parsed XML as a JavaScript object
 */
const parseXML = async (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const parser = new xml2js.Parser();
        return await parser.parseStringPromise(data);
    } catch (error) {
        console.error(`Error parsing XML file (${filePath}):`, error.message);
        throw error;
    }
};

/**
 * Upserts data into the Programme collection.
 * 
 * @function upsertProgrammes
 * @param {Array} programmes - Array of programme objects
 * @returns {Promise<void>}
 */
const upsertProgrammes = async (programmes) => {
    for (const programme of programmes) {
        await Programme.findOneAndUpdate(
            { event_id: programme.event_id },
            programme,
            { upsert: true, new: true }
        );
    }
    console.log('Programmes upserted successfully.');
};

/**
 * Upserts data into the Venue collection.
 * 
 * @function upsertVenues
 * @param {Array} venues - Array of venue objects
 * @returns {Promise<void>}
 */
const upsertVenues = async (venues) => {
    for (const venue of venues) {
        await Venue.findOneAndUpdate(
            { venue_id: venue.venue_id },
            venue,
            { upsert: true, new: true }
        );
    }
    console.log('Venues upserted successfully.');
};

/**
 * Populates the database with programme and venue data from XML.
 * 
 * @function populateDB
 * @returns {Promise<void>} - Resolves when the database is populated
 */
const populateDB = async () => {
    try {
        await connectDB();

        // Parse programmes
        const eventXML = await parseXML('./data/events.xml');
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
            likes: 0,
        }));

        await upsertProgrammes(programmes);

        // Parse venues
        const venueXML = await parseXML('./data/venues.xml');
        const venues = venueXML.venues.venue.map(venue => ({
            venue_id: venue.$.id,
            name: venue.venuee[0],
            description: venue.venuec[0],
            coordinates: {
                latitude: venue.latitude && venue.latitude[0] ? parseFloat(venue.latitude[0]) : null,
                longitude: venue.longitude && venue.longitude[0] ? parseFloat(venue.longitude[0]) : null,
            },
        }));

        await upsertVenues(venues);

        mongoose.connection.close();
        console.log('Database population completed.');
    } catch (error) {
        console.error('Error populating database:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Run the script
populateDB();
