const uploadController = require("../controller/uploadController");
const UserController = require("../controller/userController");
const addressVerify = require("../middleware/addressVerify");
const emailVerify = require("../middleware/emailVerify");
const loginDetailsValidator = require("../middleware/loginDetailsValidator");
const loginDetailsValidatorWithEmail = require("../middleware/loginDetailsValidatorWithEmail");
const registerUser = require("../middleware/registerUser");
const resetTokenValidate = require("../middleware/resetTokenValidate");
const tokenVerify = require("../middleware/tokenVerify");
const multer = require('multer');
const path = require("path");

/*
* will try later -> causing unkown err
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '/uploads'))
    },
    filename: function (req, file, cb) {
        ///const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9+ file.originalname )
        cb(null, file.originalname);
    }
});
image upload not working 
*/
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
  });
const upload = multer({ storage: multerStorage });


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
router.post("/profile-image", upload.single("avatar"), uploadController);
//router.post("/get/:id",tokenVerify,addressVerify, UserController.address);
module.exports = router;