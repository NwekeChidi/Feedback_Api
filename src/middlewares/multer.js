const path    = require('path');
const multer  = require('multer');

const baseDir = path.join(__dirname, '/../.public');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, baseDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') cb(null, true);
    else cb({ message: "Unsupported File Format!" }, false);
  }
  
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;