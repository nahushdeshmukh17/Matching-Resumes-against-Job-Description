const express = require('express');
const multer = require('multer');
const resumeParser = require('../utils/resumeParser');
const resumeProcessor = require('../services/resumeProcessor');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and images are allowed.'));
    }
  }
});

router.post('/extract', requireAuth, upload.single('resume'), async (req, res) => {
  try {
    console.log('=== RESUME UPLOAD STARTED ===');
    console.log('User ID:', req.session.userId);
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { buffer, mimetype, originalname } = req.file;
    console.log('File details:', { originalname, mimetype, size: buffer.length });
    
    console.log('Extracting text...');
    const extractedText = await resumeParser.extractText(buffer, mimetype, originalname);
    console.log('Text extracted, length:', extractedText.length);
    console.log('First 200 chars:', extractedText.substring(0, 200));
    
    console.log('Processing and storing...');
    console.log('About to call processAndStore with userId:', req.session.userId);
    
    const resumeProfile = await resumeProcessor.processAndStore(
      req.session.userId,
      originalname,
      extractedText
    );
    console.log('Resume profile created/updated:', resumeProfile._id);
    console.log('Collection should now exist in MongoDB');

    res.json({
      success: true,
      text: extractedText,
      filename: originalname,
      fileType: mimetype,
      message: 'Resume processed and stored successfully'
    });
    console.log('=== RESUME UPLOAD COMPLETED ===');
  } catch (error) {
    console.error('Resume extraction error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;