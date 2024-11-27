const multer = require('multer');
const path = require('path');

let filenama = "23"; // To store the uploaded filename

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp');
    },
    filename: (req, file, cb) => {
        filenama = Date.now() + path.extname(file.originalname);
        cb(null, filenama);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
