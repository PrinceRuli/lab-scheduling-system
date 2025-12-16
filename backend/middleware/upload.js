const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    './uploads/profiles',
    './uploads/articles',
    './uploads/reports'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads';
    
    if (file.fieldname === 'avatar') {
      uploadPath = './uploads/profiles';
    } else if (file.fieldname === 'articleImage') {
      uploadPath = './uploads/articles';
    } else if (file.fieldname === 'reportFile') {
      uploadPath = './uploads/reports';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file types
  if (file.fieldname === 'avatar') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for avatars'), false);
    }
  } else if (file.fieldname === 'articleImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for articles'), false);
    }
  } else if (file.fieldname === 'reportFile') {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Word, and Excel files are allowed for reports'), false);
    }
  } else {
    cb(new Error('Unexpected file field'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware for different upload types
exports.uploadAvatar = upload.single('avatar');
exports.uploadArticleImage = upload.single('articleImage');
exports.uploadReportFile = upload.single('reportFile');

// Multiple files upload (for future use)
exports.uploadMultiple = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'documents', maxCount: 3 }
]);