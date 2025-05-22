const multer = require("multer");

const memoryStorage = multer.memoryStorage();
const upload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    },
});

module.exports = upload;
