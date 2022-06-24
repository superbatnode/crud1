const Photo = require("../database/model/Photos");
const { cloud_name, api_key, api_secret } = require("../config");
const fs = require("fs");
const path = require("path");
const { createTestAccount } = require("nodemailer");
const CustomError = require("../error/CustomError");
const Formidable = require("formidable");
const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});
const util = require("util");

class FileUploadController {
    static async uploadPhoto(req, res, next) {
        const file = req.file;
        if (!file) {
            console.log("couldn't upload the file");
            return next(CustomError.internalServerErrror());
        }
        const filepath = path.resolve("uploads", file.filename);
        const fileName = req.id + file.originalname;
        const newFilePath = path.resolve("uploads", fileName);
        fs.rename(filepath, newFilePath, (err) => err && console.log(err));
        const photo = await Photo.findOne({ user: req.id });
        if (photo === null) {
            try {
                const addphoto = await Photo({ user: req.id, photo: fileName, src: "local" }).save();
                console.log("photo saved");
                console.log(addphoto);
                res.json({ photo: "saved successfully" });
            } catch (e) {
                console.log(e);
                res.json(CustomError.internalServerErrror());
            }
        }
        if (photo) {
            try {
                const updatePhoto = await Photo.updateOne({ user: req.id }, { photo: fileName });
                const oldPhotoName = photo.photo;
                if (oldPhotoName !== fileName)
                    fs.unlink(path.resolve("uploads", oldPhotoName), (e) => e && console.log(e));
                console.log("photo saved");
                res.json({ photo: "saved successfully" });
            } catch (e) {
                console.log(e);
                res.json(CustomError.internalServerErrror());
            }
        }
    }
    static async getPhoto(req, res, next) {
        const photo = await Photo.findOne({ user: req.id });
        console.log(photo);
        if (!photo)
            return next("photo not found");

        const photoName = photo.photo;
        const photoWithPath = path.resolve("uploads", photoName);
        res.sendFile(photoWithPath, (e) => {
            if (e)
                next(e);
            else {
                console.log("file sent");
                next();
            }
        })
    }
    static async uploadPhotoRemote(req, res, next) {
        const file = req.file;
        if (!file) {
            console.log("couldn't upload the file");
            return next(CustomError.internalServerErrror());
        }
        const filepath = path.resolve("uploads", file.filename);
        const fileName = req.id + file.originalname;
        const newFilePath = path.resolve("uploads", fileName);
        fs.rename(filepath, newFilePath, (err) => err && console.log(err));
        //uploading file to cloudinary
        try{
        cloudinary.v2.uploader.upload(
            path.resolve("uploads", fileName),
            { public_id: req.id },
            (err, result) => {
                if (err)
                    next("cant upload this time");
                console.log(result);
                res.json({url: result.url});
            });
        }catch(e){
            return next(e);
        }
    }
}


module.exports = FileUploadController; 
