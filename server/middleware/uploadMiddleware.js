import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadsDir = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || '.pdf').toLowerCase() || '.pdf';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExtension = path.extname(file.originalname || '').toLowerCase() === '.pdf';

  if (isPdfMime || isPdfExtension) {
    cb(null, true);
    return;
  }

  cb(new Error('Only PDF files are allowed'));
};

const uploadPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export { uploadPdf };
