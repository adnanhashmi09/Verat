const multer = require('multer');

module.exports.multConfig = (location, asset) => {
    const multStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./uploads/${location}`);
        },
        filename: (req, file, cb) => {
            cb(null, `${new Date().toISOString()}_${file.originalname}`);
        }
    });

    const multFilter = (req, file, cb) => {
        const type = file.mimetype;
        if (type === 'image/jpeg' || type === 'image/png' || type === 'image/jpg') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const upload = multer({
        storage: multStorage,
        fileFilter: multFilter,
    }).single(asset);

    return upload;
};

module.exports.getData = () => multer().any();
