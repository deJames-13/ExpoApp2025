import { cloudinary } from '#common';
import { uploadBase64Image } from '#utils/cloudinary.utils';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v4 as uuidv4 } from 'uuid';

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let tags = [req?.headers?.resource, req?.body?.id, req?.params?.id];
    tags = tags.length > 0 ? tags : 'n/a';

    const allowed_formats = ['jpg', 'png', 'jpeg', 'gif', 'webp'];
    const folder = req?.headers?.resource || 'uploads';
    const sanitizedFilename = file?.originalname.replace(/[^a-zA-Z0-9]/g, '_');
    const public_id = `${sanitizedFilename}_${uuidv4()}`;
    const secure_url = cloudinary.url(`${folder}/${public_id}`, { secure: true });

    cloudinary.api.create_folder(folder, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Folder created: ${folder}`);
      }
    });

    const cloudinaryOptions = {
      folder,
      public_id,
      url: cloudinary.url(`${folder}/${public_id}`),
      resource_type: 'auto',
      secure_url,
      tags,
      allowed_formats,
    };

    // append cloudinary options to request file properties
    Object.assign(file, cloudinaryOptions);

    return cloudinaryOptions;
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: (req, file, cb) => {
    const allowed_formats = ['jpg', 'png', 'jpeg', 'gif', 'webp'];
    const format = file.mimetype.split('/')[1];
    if (allowed_formats.includes(format)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format!'));
    }
  },
});

/**
 * Middleware for handling base64 encoded images
 * This doesn't replace multer, but works alongside it
 * Use this middleware after multer if you need to support both file uploads and base64
 */
export const handleBase64Upload = (fieldName = 'avatar', options = {}) => {
  return async (req, res, next) => {
    try {
      // Skip if already processed by multer with files
      if (req.files && req.files.length > 0) {
        return next();
      }

      // Check if we're dealing with a single file or an array of files
      const isArrayMode = options.arrayMode || false;

      if (isArrayMode) {
        // Handle array of base64 images
        const base64Images = req.body[fieldName];

        // If no image data or already processed, continue
        if (!base64Images || (req.file && req.files)) {
          return next();
        }

        // Initialize req.base64Files array
        req.base64Files = [];

        // Handle array of base64 strings
        if (Array.isArray(base64Images)) {
          // Process each base64 image
          for (const base64Data of base64Images) {
            if (typeof base64Data === 'string' && base64Data.startsWith('data:image')) {
              await processBase64Image(req, base64Data, fieldName, options);
            }
          }
        }
        // Handle single base64 string that might have been passed
        else if (typeof base64Images === 'string' && base64Images.startsWith('data:image')) {
          await processBase64Image(req, base64Images, fieldName, options);
        }

        // Remove the base64 data from the request body to save memory
        delete req.body[fieldName];
      } else {
        // Handle single base64 image (existing logic)
        const base64Data = req.body[fieldName];

        // Skip if no image data or already processed
        if (!base64Data || req.file) {
          return next();
        }

        if (typeof base64Data === 'string' && base64Data.startsWith('data:image')) {
          await processBase64Image(req, base64Data, fieldName, options);
        }

        // Remove the base64 data from the request body to save memory
        delete req.body[fieldName];
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Helper function to process a single base64 image
 */
async function processBase64Image(req, base64Data, fieldName, options) {
  // Get folder name
  const folder = req?.headers?.resource || options.folder || 'uploads';

  // Upload to Cloudinary
  const result = await uploadBase64Image(base64Data, {
    folder,
    tags: [req?.headers?.resource, req?.body?.id, req?.params?.id],
    ...options
  });

  // Create a file object similar to what multer would create
  const fileObj = {
    fieldname: fieldName,
    originalname: `base64_image_${Date.now()}`,
    encoding: '7bit',
    mimetype: base64Data.split(';')[0].split(':')[1],
    path: result.secure_url,
    size: Math.round(base64Data.length * 0.75), // Approximate size
    public_id: result.public_id,
    url: result.url,
    secure_url: result.secure_url,
    folder: folder,
    resource_type: result.resource_type || 'image',
    format: result.format,
    width: result.width,
    height: result.height,
  };

  // If we're handling an array, add to base64Files array
  if (options.arrayMode) {
    if (!req.base64Files) req.base64Files = [];
    req.base64Files.push(fileObj);
  } else {
    // Otherwise, set as single base64File property
    req.base64File = fileObj;
  }
}

