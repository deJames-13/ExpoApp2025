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

/**
 * Upload a base64 image to Cloudinary
 * @param {string} base64String - Base64 encoded image string with data URI (data:image/jpeg;base64,...)
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload response
 */
const uploadBase64Image = async (base64String, options = {}) => {
  try {
    // Set default folder if not provided
    const folder = options.folder || 'uploads';

    // Generate upload options
    const uploadOptions = {
      folder,
      resource_type: 'auto',
      ...options
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, uploadOptions);

    return {
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error('Error uploading base64 image to Cloudinary:', error);
    throw error;
  }
};

export { deleteFile, deleteFileOnError, deleteFiles, uploadBase64Image };
