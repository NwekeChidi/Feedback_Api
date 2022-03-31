const fs                  = require('fs');
const { User }            = require('../models/user');
const AppError            = require('../errors/appError');
const catchAsync          = require('../utils/catchAsync');
const { cloudUpload }     = require('../utils/cloudinary');
const upload              = require('../middlewares/multer');
const handlerFactory      = require('../utils/handlerFactory');

const userController = {};

// upload image middleware
userController.uploadImage = upload.single('image');

// update profile
userController.editProfile = catchAsync( async (req, res, next) => {
    // get current user
    const user = await User.findOne({ _id:req.USER_ID });
    if (!user) return next(new AppError("User Not Found", 403));
    
    const payload = req.body;
    let imgDet;
    // check if user uploaded a profile picture
    if (req.file){
        const file = req.file, { path } = file;
        imgDet = await cloudUpload(path);

        if (!imgDet) {
            fs.unlinkSync(path);
            return next(new AppError("Network Error!", 503));
        }
        fs.unlinkSync(path);

    } else return next(new AppError("Something went wrong while trying to upload image :(", 400));

    User.findOneAndUpdate({ _id: req.USER_ID },
        {
            $set:{
                company: payload.company?payload.company:user.company,
                title: payload.title?payload.title:user.title,
                socialUrl: payload.socialUrl?payload.socialUrl:user.socialUrl,
                mobile: payload.mobile?payload.mobile:user.mobile,
                profilePhotoUrl: imgDet?.url?imgDet.url:user.profilePhotoUrl
            }
        },
        { new : true },
        (err, result) => {
            if (err) return next(new AppError("Problem updating profile!", 400));
            else {
                return res.status(200).send({
                message: "Profile Update Successful!"
                });
            }
        }
    )
});

userController.getMe = catchAsync( async (req, res, next) => {
    const me = await handlerFactory.getOne(User, req.USER_ID);
    if (!me) return next(new AppError("Error Retrieving Profile!", 400));
    res.status(200).send({
        message: "Successfully Retrieved Profile",
        me
    })
})

module.exports = userController;