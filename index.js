const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const multer = require("multer");
const path = require('path');
const fs = require('fs');

const port = 3030;
const uploadsDir = './uploads/'
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });




// A messages service that allows to create new
// and return all existing messages
class FileService {
    constructor() {
    }

    async find() {
        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                console.log('Unable to scan directory: ' + err);
            }
            files.forEach(console.log);
            return files
        });
    }

    async create(data) {
        // you use this method to save in DB but as the purpose of the app is
        // to be an upload server, you already used multer to save files before
        // this Service in app.use('files', multer.any(), new FileService)
        return data;
    }
}





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
// Register an in-memory messages service
app.use('/files',
    upload.any(),
    new FileService()
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

// app.post("/upload", upload.any(), function (req, res, next) {
//     console.log(req.files || req.file);
//     if (req.files || req.file) {
//         return res.status(200).json(req.files || req.file);
//     }
//     return res.status(400).json({ msg: "PLEASE UPLOAD FILE" });
// });

// app.get('/', (req, res, next) => {
//     return res.sendFile(path.join(__dirname, 'public/index.html'));
// })

// app.listen(
//     port,
//     () => {
//         console.log('Listening on http://localhost:' + port)
//     }
// );