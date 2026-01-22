const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

class ResumeParser {
  async extractText(buffer, mimeType, filename) {
    try {
      console.log(`Processing file: ${filename}, type: ${mimeType}`);
      
      if (mimeType === 'application/pdf') {
        return await this.extractFromPDF(buffer);
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await this.extractFromDOCX(buffer);
      } else if (mimeType.startsWith('image/')) {
        return await this.extractFromImage(buffer);
      } else {
        throw new Error(`Unsupported file type: ${mimeType}`);
      }
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error(`Failed to extract text from ${filename}: ${error.message}`);
    }
  }

  async extractFromPDF(buffer) {
    throw new Error('PDF processing not available. Please convert your PDF to an image (PNG/JPG) and upload that instead.');
  }

  async extractFromDOCX(buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return this.cleanText(result.value);
  }

  async extractFromImage(buffer) {
    console.log('Starting OCR processing...');
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text' && m.progress === 1) {
          console.log('OCR completed!');
        }
      }
    });
    console.log('=== EXTRACTED TEXT FROM IMAGE ===');
    console.log(text);
    console.log('=== END EXTRACTED TEXT ===');
    return this.cleanText(text);
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }
}

module.exports = new ResumeParser();