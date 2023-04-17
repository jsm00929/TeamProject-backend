import multer from 'multer';
import path from 'path';
import { v4 as createUuid } from 'uuid';
import { AppError } from '../core/types';
import { HttpStatus } from '../core/constants';

const dir = path.join(process.cwd(), 'public', 'uploads', 'images');

const getUploadDir = (uploadDir: string, availableExtRegex: RegExp) =>
  multer.diskStorage({
    destination: (req, file, fn) => {
      fn(null, uploadDir);
    },
    filename: (req, file, fn) => {
      const ext = path.extname(file.filename);
      if (!availableExtRegex.test(ext.slice(1))) {
        const err = AppError.new({
          message: `파일 업로드에 실패하였습니다. 지원되지 않는 확장자입니다.
          파일명: ${file.filename}`,
          status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        });

        return fn(err, file.filename);
      }

      const randomFilename = createUuid() + ext;

      fn(null, randomFilename);
    },
  });

const handleImagesUpload = multer({});
