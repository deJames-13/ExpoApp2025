import { cloudinary } from '#common';
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

