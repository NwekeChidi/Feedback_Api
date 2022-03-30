const { config, uploader } = require('cloudinary');


const cloudinaryConfig = ( req, res, next ) => { 
    config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    next();
}

const uploads = ( file, folder ) => {
    return new Promise(resolve => {
        uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            });
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}
const cloudUpload = async (path) => await uploads(path, "Images");

module.exports = { cloudinaryConfig, cloudUpload };