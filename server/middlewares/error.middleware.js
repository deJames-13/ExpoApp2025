import { NODE_ENV } from '#config';
import { APP } from '#constants';
import * as utils from '#utils';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorMiddleware = async (err, req, res, next) => {
  let statusCode = err?.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // if there are files in cloudinary, delete them
  try {
    if (err && (req.file || req.files)) {
      const publicIds = req?.files?.map((image) => `${image.folder}/${image.public_id}`);
      await utils.deleteFiles(publicIds);
    }
  } catch (error) {
    console.error(error);
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }
  res.status(statusCode).json({
    ...err,
    message,
    statusCode,
    status: err.name,
    stack: NODE_ENV === APP.STATUS.PRODUCTION ? null : err.stack,
  });
};
