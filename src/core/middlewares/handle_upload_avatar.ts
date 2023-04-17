import multer from 'multer';
import path from 'path';
import { v4 as createUuid } from 'uuid';
import { AppError } from '../types';
import { ErrorMessages, HttpStatus } from '../constants';
import { IMAGE_EXT_REGEX, UPLOADS_TEMP_PATH } from '../../config/constants';
import { Request } from 'express';

const imagesDir = path.join(process.cwd(), UPLOADS_TEMP_PATH);

const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, imagesDir);
  },
  filename: (req, file, fn) => {
    const ext = path.extname(file.originalname);
    const randomFilename = createUuid() + ext;
    fn(null, randomFilename);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  fn: multer.FileFilterCallback,
) => {
  const ext = path.extname(file.originalname);
  if (!IMAGE_EXT_REGEX.test(ext.slice(1))) {
    const err = AppError.new({
      message: ErrorMessages.INVALID_FILE_TYPE + file.filename,
      status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    });
    return fn(err);
  }
  fn(null, true);
};

export const handleUploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 },
});
