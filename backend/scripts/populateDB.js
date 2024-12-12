// scripts/populateDB.js
const fs = require('fs');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const Programme = require('../models/Programme');
const Venue = require('../models/Venue');

const connectDB = async () => {
  await mongoose.connect('mongodb://localhost:27017/eventDB', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected.');
};

const parseXML = async (filePath) => {
  const data = fs.readFileSync(filePath);
  const parser = new xml2js.Parser();
  return parser.parseStringPromise(data);
};

const populateDB = async () => {
  try {
    await connectDB();

    // Parse and insert programmes
    const eventXML = await parseXML('./data/events.xml');
    const programmes = eventXML.events.event.map(event => ({
      event_id: event.$.id, // Use unique event_id
      title: event.titlee[0],
      venueId: event.venueid[0],
      dateRange: event.predateE[0], // Store date range as a string
      duration: event.progtimee[0],
      price: event.pricee[0],
      description: event.desce[0],
      presenter: event.presenterorge[0],
      type: event.typee ? event.typee[0] : null, // Programme Type
      language: event.languagee ? event.languagee[0] : null, // Language
      remarks: event.remarkC ? event.remarkC[0] : null, // Remarks
      eventUrl: event.tagenturle ? event.tagenturle[0] : null, // Promotional URL
      enquiry: event.enquiry ? event.enquiry[0] : null, // Enquiry phone number
    }));
    await Programme.insertMany(programmes);

    console.log('Database populated with enriched programme data.');
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

populateDB();


