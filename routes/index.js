const FileuploadController = require("../controller/FileUploadController");
const UserController = require("../controller/userController");
const addressVerify = require("../middleware/addressVerify");
const emailVerify = require("../middleware/emailVerify");
const loginDetailsValidator = require("../middleware/loginDetailsValidator");
const loginDetailsValidatorWithEmail = require("../middleware/loginDetailsValidatorWithEmail");
const registerUser = require("../middleware/registerUser");
const resetTokenValidate = require("../middleware/resetTokenValidate");
const tokenVerify = require("../middleware/tokenVerify");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' })

const router = require("express").Router();
router.get("/all_users", UserController.alluser);
router.post("/registration", registerUser, UserController.register)
router.post("/login", loginDetailsValidator, UserController.login);
router.get("/get", tokenVerify, UserController.getUser);
router.get("/get/all", tokenVerify, UserController.getUserWithAllDetails);
router.put("/delete", tokenVerify, UserController.deleteUser);
router.get("/list/:page", UserController.listOfTen);
router.post("/address", tokenVerify, addressVerify, UserController.address);
router.delete("/address", tokenVerify, UserController.deleteAddress);
router.post("/forget-password", emailVerify, UserController.forgetPassword);
router.post("/forget-password/reset", resetTokenValidate, loginDetailsValidatorWithEmail, UserController.forgetPasswordReset);
router.post("/profile-image", tokenVerify, upload.single("avatar"), FileuploadController.uploadPhoto);
router.get("/profile-image", tokenVerify, FileuploadController.getPhoto);
router.post("/profile-image-remote", tokenVerify, upload.single("avatar"), FileuploadController.uploadPhotoRemote);
//router.post("/get/:id",tokenVerify,addressVerify, UserController.address);
module.exports = router;