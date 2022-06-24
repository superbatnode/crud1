const { User, Address } = require("../database");
const bcrypt = require("bcrypt");
const { exist } = require("joi");
const CustomError = require("../error/CustomError");
const { access_token, check_token } = require("../auth/token");
const Joi = require("joi");
const Token = require("../database/model/Token");
const { email, username, password } = require("../config");
const nodemailer = require("nodemailer");
const { saltRounds } = require('../config');
var rand = require("random-key");
const ResetPassword = require("../database/model/ResetPassword");

class UserController {
    static async register(req, res, next) {
        console.log(typeof saltRounds);
        const { username, firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const usernameExists = await User.exists({ username });
        if (usernameExists)
            return next("username already exists");

        const emailExists = await User.exists({ email });
        if (emailExists)
            return next("Email already exists");

        try {
            const save = await user.save()
        } catch (e) {
            next(e);
        }

        res.json(req.body);

    }

    static async alluser(req, res, next) {
        const users = await User.find({}, "firstName lastName email");
        res.json(users);
    }

    static async login(req, res, next) {
        console.log(req.body);
        const exist = await User.findOne({ username: req.body.username });
        if (!exist)
            return next(CustomError.unauthorized("User doesn't exist"));

        const passwordMatched = await bcrypt.compare(req.body.password, exist.password)

        if (!passwordMatched)
            return next(CustomError.invalidInput("password or username is invalid "));

        try {
            const token = await access_token({
                _id: exist._id,
                username: exist.username,
            });
            res.json({
                access_token: token
            });
        } catch (e) {
            return next("couldn't create token: ", e);
        }
    }

    static async getUser(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.id }, "firstName lastName email username");
            res.json(user);
        }
        catch (e) {
            next(e);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const del = await User.deleteOne({ _id: req.id })
            res.send(del);
        } catch (e) {
            next(e);
        }
    }

    static async listOfTen(req, res, next) {
        const page = Number(req.params.page);
        if (!page)
            return next(CustomError.Error404("Not a valid page"));
        const limit = 10;
        const user = await User.find().limit(limit).skip((page - 1) * limit).exec();
        const count = await User.countDocuments();
        try {
            res.json({
                user,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            })
        }
        catch (err) {
            return next(err);
        }

    }

    static async address(req, res, next) {
        const pincode = Number(req.body.pincode);
        const phoneno = Number(req.body.phoneno);
        const _id = req.id;
        let add = { ...req.body };
        add.phoneno = phoneno;
        add.pincode = pincode;
        add.user = _id;
        try {
            //adding the adress ref to the user fiedl
            const addr = await Address(add).save();
            const user = await User.findOne({ _id })
            user.address.push(addr._id);
            user.save();
            ///const getuser = await User.findOne({ _id }).populate("address");
            res.json({ address: addr, id: addr._id });
        } catch (e) {
            return next(e);
        }
    }

    static async getUserWithAllDetails(req, res, next) {
        const allDetail = await User.findOne({ _id: req.id }, "-password -__v ").populate({ path: "address", select: "address city state pincode phoneno -_id" }).
            exec();
        ;
        if (!allDetail)
            return next(CustomError.Error404("User not found: Internal Server Error"));
        res.json(allDetail);
    }
    static async deleteAddress(req, res, next) {
        //const address = await Address.findOne(req.body);
        // if(address===null)
        // return next(CustomError.Error404("address not found in the database"));
        if (!req.body.id)
            return next("id not found");
        const del = await Address.findOneAndDelete({ _id: req.body.id });
        if (del)
            res.json(del)
        else return next("cannot delete");
    }

    static async forgetPassword(req, res, next) {
        let user = null;
        try {
            user = await User.findOne({ email: req.body.email }, "-password -__v");
        } catch (e) {
            return next(e);
        }
        if (!user)
            return next(CustomError.unauthorized("this user doesn't exist"));
        //generate access token
        const token = await access_token({
            _id: user._id,
            email: user.email
        }, 600);
        try {
            const saveToken = await Token({ token, email: user.email }).save();
        } catch (e) {
            console.log(e, '=======')
            return next(e);
        }
        // res.header({token:token});
        res.json({ reset_token: token });
    }

    static async forgetPasswordReset(req, res, next) {
        if (!req.resetPassword)
            return next(CustomError.unauthorized());
        console.log(req.resetPassword)
        const hashedPassword = await bcrypt.hash(req.body.reset_password, saltRounds);
        const updatePassword = await User.findOneAndUpdate({ email: req.resetPassword.validate.email }, { password: hashedPassword });
        const deleteAllTokens = await Token.deleteMany({ email: req.resetPassword.validate.email })
        console.log(updatePassword);
        res.json({ update: "done" });
    }

    static async passwordResetThroughEmailLink(req, res, next) {
        const user = await User.exists({ email: req.body.email });
        if (!user)
            return next(CustomError.unauthorized("user is not found"));
        const tempPassword = rand.generateDigits(8);
        console.log(saltRounds);
        const reset_token = await access_token({
            email: req.body.email,
            resetPassword: await bcrypt.hash(tempPassword, 10)
        }, 600);
        const resetPassword = await ResetPassword({
            email: req.body.email,
            token: reset_token,
            password: tempPassword,
        }).save();
        //will send the new password to user 
        EmailSendMain(reset_token, req.body.email).catch(console.error);
        res.json({ ok: "ok" })
    }
    static async passwordResetNext(req, res, next) {
        const resetToken = req.query.token;
        let validate = null;
        try {
            validate = await check_token(resetToken);
            console.log(validate);
        } catch (err) {
            return next(err);
        }
        const verifyInDB = await ResetPassword.findOne({ token: resetToken });
        if (!verifyInDB)
            return next(CustomError.unauthorized("Access Denied"));

        const validatePassword = await bcrypt.compare(verifyInDB.password, validate.resetPassword)

        if (validatePassword) {
            const newPassword = rand.generate(8);
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updateIntoMain = await User.updateOne({ email: validate.email }, { password: hashedPassword });
            const deleteEverythingInPasswordResetDb = await ResetPassword.deleteMany({ email: validate.email });
            EmailSendMain()
            res.json({ newPassword });
        } else {
            res.next(CustomError.unauthorized("unauthorized web page"));
        }
        console.log(validatePassword);

        console.log(verifyInDB);

    }
}


const EmailSendMain = async (token, recevier) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        auth: {
            user: email,
            pass: password,
        },
    });
    let info = await transporter.sendMail({
        from: '"Test Rest API" <superbatnode@outlook.com>', // sender address
        to: recevier, // list of receivers
        subject: "Reset Your Password", // Subject line
        html: `<b>Reset  Your Password Here</b><br><a href="http://localhost:5000/user/password-reset?token=${token}">Click Me</a>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
}

module.exports = UserController; 