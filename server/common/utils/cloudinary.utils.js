import { cloudinary } from '#common';

const deleteFiles = async (publicIds) => {
  try {
    await cloudinary.api.delete_resources(publicIds);
    console.log('Files deleted from Cloudinary:', publicIds);
  } catch (deleteError) {
    console.error('Error deleting files from Cloudinary:', deleteError);
  }
};

const deleteFile = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

const deleteFileOnError = async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    await deleteFile(req.file.public_id);
    throw error;
  }
};

export { deleteFile, deleteFileOnError, deleteFiles };
