
const fs = require('fs');
const { uploadsDir } = require('./config');

// A files service that allows to create new
// and return all existing files
class FilesService {
    constructor() {
    }

    async find() {
        return new Promise((resolve, reject) => {
            fs.readdir(uploadsDir, (err, files) => err ? reject(err) : resolve(files));
        });
    }

    async create(data) {
        // you use this method to save in DB but as the purpose of the app is
        // to be an upload server, you already used multer to save files before
        // this Service in app.use('files', multer.any(), new FileService)
        return data;
    }
}

module.exports = FilesService;