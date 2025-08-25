const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UPLOAD_PATH, MAX_FILE_SIZE } = require('../config/env');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = path.join(UPLOAD_PATH, '/');
    if (file.fieldname === 'image') {
      folder += 'images/';
    } else if (file.fieldname === 'model') {
      folder += 'models/';
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Check file type for images
const imageFileFilter = (req, file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
};

// Check file type for 3D models
const modelFileFilter = (req, file, cb) => {
  // Allowed extensions
  const filetypes = /glb|gltf|usdz/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb('Error: Only GLB, GLTF, and USDZ files are allowed!');
  }
};

// Init upload for images
const uploadImage = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Use environment variable
  fileFilter: imageFileFilter,
}).single('image');

// Init upload for 3D models
const uploadModel = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Use environment variable
  fileFilter: modelFileFilter,
}).single('model');

// @desc    Upload image
// @route   POST /api/upload/image
// @access  Private

exports.getModel = (req, res) => {
  try {
    const { restaurantId, modelName } = req.params;

    // Path where model files are stored
    const modelPath = path.join(__dirname, '..', 'uploads', 'models', restaurantId, modelName);

    if (!fs.existsSync(modelPath)) {
      return res.status(404).json({
        success: false,
        message: 'Model file not found',
      });
    }

    return res.sendFile(modelPath);
  } catch (error) {
    console.error('Error fetching model:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.getImage = (req, res) => {
  try {
    const { restaurantId, imageName } = req.params;
    const imagePath = path.join(__dirname, '..', 'uploads', 'images', restaurantId, imageName);
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    } else {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadImage = (req, res) => {
  uploadImage(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Construct the file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/api/upload/images/${req.user.restaurantId}/${req.file.filename}`;

    res.json({
      filePath: fileUrl,
    });
  });
};

// @desc    Upload 3D model
// @route   POST /api/upload/model
// @access  Private
exports.uploadModel = (req, res) => {
  uploadModel(req, res, function(err) {
    try {
      if(err){
        return res.status(200).json({
          success: false,
          message: "error in uploading model"
        });
      }
      const modelDir = path.join(__dirname, "..", "uploads", "models", req.user.restaurantId.toString());

      if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
      }
      const modelFile = req.file;

      if (!modelFile) {
        return res.status(400).json({ success: false, message: "No model file uploaded" });
      }

      const targetPath = path.join(modelDir, modelFile.originalname);
      fs.renameSync(modelFile.path, targetPath);

      return res.status(200).json({
        success: true,
        message: "Model uploaded successfully",
        fileUrl: `${req.protocol}://${req.get("host")}/uploads/models/${req.user.restaurantId}/${modelFile.originalname}`,
      });
    } catch (error) {
      console.error("Error uploading model:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });
};