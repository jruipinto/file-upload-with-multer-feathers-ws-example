const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const multer = require("multer");
const path = require('path');
const FilesService = require('./files-service')

const { port, uploadsDir } = require('./config');
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });


// Creates an ExpressJS compatible Feathers application
const app = express(feathers());

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Host static files from the current folder
app.use(express.static(path.join(__dirname, 'public/')));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register files service
app.use('/files',
    upload.any(),
    new FilesService()
);
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// Add any new real-time connection to the `everybody` channel
app.on('connection', connection =>
    app.channel('everybody').join(connection)
);
// Publish all events to the `everybody` channel
app.publish(data => app.channel('everybody'));

// Start the server
app.listen(port).on('listening', () =>
    console.log('Feathers server listening on localhost:3030')
);