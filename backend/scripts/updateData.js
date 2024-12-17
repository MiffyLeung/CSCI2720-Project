// backend/scripts/updateData.js
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

    for (const programmeData of programmes) {
        try {
            // Find the corresponding Venue
            const venue = await Venue.findOne({ venue_id: programmeData.venue_id });
            if (!venue) {
                console.error(`Venue not found for venue_id: ${programmeData.venue_id}`);
                continue;
            }

            // Replace venue_id with Venue's ObjectId
            programmeData.venue = venue._id;
            delete programmeData.venue_id;

            // Preserve existing likes and comments
            const existingProgramme = await Programme.findOne({ event_id: programmeData.event_id });
            if (existingProgramme) {
                programmeData.likes = existingProgramme.likes || 0;
                programmeData.comments = existingProgramme.comments || [];
            } else {
                programmeData.likes = 0;
                programmeData.comments = [];
            }

            // Upsert the Programme
            await Programme.findOneAndUpdate(
                { event_id: programmeData.event_id },
                programmeData,
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error(`Error upserting programme with event_id: ${programmeData.event_id}`, error.message);
        }
    }

    // Mark old programmes as deleted
    await Programme.updateMany(
        { event_id: { $nin: newProgrammeIds } },
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
    try {
        // Map to store newly inserted venues for comparison
        const newVenueIds = [];

        for (const venueData of venues) {
            // Check if the venue already exists in the database
            let venue = await Venue.findOne({ venue_id: venueData.venue_id });

            if (!venue) {
                // Create a new Venue if it doesn't exist
                venue = new Venue({
                    venue_id: venueData.venue_id,
                    name: venueData.name,
                    coordinates: venueData.coordinates,
                    programmes: [] // Initialize programmes array
                });

                console.log(`Creating new venue: ${venueData.venue_id}`);
            } else {
                // Update existing venue data (non-array fields only)
                venue.name = venueData.name;
                venue.coordinates = venueData.coordinates;
                console.log(`Updating existing venue: ${venueData.venue_id}`);
            }

            // Save the venue and collect its ObjectId
            const savedVenue = await venue.save();
            newVenueIds.push(savedVenue._id);
        }

        // Mark old venues as deleted if they are no longer in the dataset
        await Venue.updateMany(
            { _id: { $nin: newVenueIds } }, // Filter venues not in the new dataset
            { deleted: true }
        );

        console.log('Venues upserted and old ones marked as deleted.');
    } catch (error) {
        console.error('Error in upsertVenues:', error.message);
        throw error;
    }
};


/**
 * Updates the list of programme IDs for each venue.
 * 
 * @function updateVenueProgrammes
 * @returns {Promise<void>}
 */
const updateVenueProgrammes = async () => {
    console.log('Updating venue programmes...');

    try {
        // Fetch all venues
        const venues = await Venue.find({});
        if (!venues.length) {
            console.log('No venues found.');
            return;
        }

        // Update each venue with related programme IDs
        for (const venue of venues) {
            const relatedProgrammes = await Programme.find(
                { venue_id: venue.venue_id }, // Match programmes by venue_id
                { event_id: 2 } // Select only the event_id field
            );

            if (!relatedProgrammes.length) {
                console.log(`No programmes found for venue_id: ${venue.venue_id}`);
            }

            const programmeIds = relatedProgrammes.map(p => p.event_id);

            await Venue.findOneAndUpdate(
                { venue_id: venue.venue_id },
                { programmes: programmeIds }, // Update the programmes array
                { new: true } // Return the updated document
            );

            console.log(`Updated programmes for venue_id: ${venue.venue_id}`);
        }

        console.log('Venue programmes updated.');
    } catch (error) {
        console.error('Error updating venue programmes:', error.message);
    }
};

/**
 * Populates the database with programme and venue data from online XML files.
 * 
 * @function updateData
 * @returns {Promise<void>} - Resolves when the database is populated
 */
const updateData = async () => {
    try {
        await connectDB();

        // Step 1: Process Venue Data
        const venueXMLUrl = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml';
        console.log('Fetching venue data...');
        const venueXMLContent = await fetchXML(venueXMLUrl);
        const venueXML = await parseXML(venueXMLContent);
        const venues = venueXML.venues.venue.map(venue => ({
            venue_id: venue.$.id.trim(), // Ensure venue_id is clean
            name: venue.venuee[0],
            description: venue.venuec[0],
            coordinates: {
                latitude: venue.latitude && venue.latitude[0] ? parseFloat(venue.latitude[0]) : null,
                longitude: venue.longitude && venue.longitude[0] ? parseFloat(venue.longitude[0]) : null,
            },
            programmes: [], // Initialize with an empty array
        }));
        await upsertVenues(venues); // Upsert Venue data

        // Step 2: Process Programme Data
        const eventXMLUrl = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml';
        console.log('Fetching event data...');
        const eventXMLContent = await fetchXML(eventXMLUrl);
        const eventXML = await parseXML(eventXMLContent);
        const programmes = eventXML.events.event.map(event => {
            const rawSubmitDate = event.submitdate ? event.submitdate[0] : null;
            let submitdate = null;

            // Convert HK time (rawSubmitDate) to UNIX timestamp
            if (rawSubmitDate) {
                const hkDate = new Date(rawSubmitDate.replace(" ", "T") + "+08:00"); // Add timezone offset for HK
                submitdate = Math.floor(hkDate.getTime() / 1000); // Convert to UNIX timestamp (in seconds)
            }

            return {
                event_id: event.$.id,
                title: event.titlee[0],
                venue_id: event.venueid[0], // Use venue_id for matching
                dateline: event.predateE[0], // Original datetime range for display
                duration: event.progtimee[0], // Duration of the programme
                price: event.pricee[0], // Price information
                description: event.desce[0], // Description of the programme
                presenter: event.presenterorge[0], // Presenter or organizer
                type: event.cat2 ? event.cat2[0] : null, // Programme type
                remarks: event.remarke ? event.remarke[0] : null, // Additional remarks
                eventUrl: event.urle ? event.urle[0] : null, // Promotional URL
                enquiry: event.enquiry ? event.enquiry[0] : null, // Enquiry phone number
                submitdate: submitdate, // Converted submission date in UNIX timestamp
            };
        });


        await upsertProgrammes(programmes); // Upsert Programme data

        // Step 3: Update Venue's programmes Field
        console.log('Updating venue programmes...');
        const allVenues = await Venue.find({}); // Fetch all venues
        for (const venue of allVenues) {
            // Find all Programmes linked to this Venue
            const programmesForVenue = await Programme.find(
                { venue: venue._id }, // Match by Venue's ObjectId
                { _id: 1 } // Only retrieve the Programme's ObjectId
            );

            // Update Venue's programmes field with the array of Programme ObjectIds
            venue.programmes = programmesForVenue.map(p => p._id);
            await venue.save();

            console.log(`Updated programmes for venue_id: ${venue.venue_id}`);
        }
        console.log('Venue programmes updated.');

        console.log('Database population completed.');
    } catch (error) {
        console.error('Error populating database:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Execute updateData only if this script is run directly
if (require.main === module) {
    updateData()
        .then(() => {
            console.log('Data update completed. Exiting...');
            process.exit(0); // Exit with a success code
        }).catch((error) => {
            console.error('Error updating data:', error);
            process.exit(1); // Exit with a failure code
        });
}

// Export updateData function for external use
module.exports = updateData;
