const { generateVerifyToken, authGuard, admin } = require("../middleware/auth");
const { transporter } = require("../middleware/sendEmail");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const { Company, validateCompany } = require("../models/company");
const express = require("express");
const router = express.Router();

router.get("/getAllUsers", [authGuard, admin], async (req, res) => {
  const users = await User.find()
    .sort("first_name")
    .populate({ path: "company", select: "comapany_name" })
    .select(
      "_id first_name last_name role isSeller isBuyer email company status"
    );

  return res.status(200).send({
    users,
    responseCode: "00",
    responseDescription: `Successful`,
  });
});

router.get("/:userId", async (req, res) => {
  const users = await User.findById(req.params.userId)
    .populate({ path: "company", select: "company_name" })
    .select(
      "_id image_upload first_name last_name position role isSeller isBuyer business_unit email country mobile status preferences"
    );

  return res.status(200).send({
    users,
    responseCode: "00",
    responseDescription: `Successful`,
  });
});

router.patch("/updateProfile/:userId", async (req, res) => {
  let user = await User.findById(req.params.userId);
  // console.log(user);
  if (user) {
    user = await User.updateOne(
      { _id: req.params.userId },
      {
        $set: {
          image_upload: req.body.image_upload,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          position: req.body.position,
          role: req.body.role,
          // company_name: req.body.company_name,
          business_unit: req.body.business_unit,
          email: req.body.email,
          mobile: req.body.mobile,
          "preferences.language": req.body.preferences?.language,
          "preferences.timezone": req.body.preferences?.timezone,
          "preferences.currency": req.body.preferences?.currency,
        },
      }
    );

    res.send({
      user,
      responseCode: "00",
      responseDescription: "User profile updated Successfully",
    });
  } else {
    res.send({
      responseCode: "99",
      responseDescription: `User with id ${req.params.id} does not exist`,
    });
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
  });

  let existingCompany = await Company.findOne({
    company_name: req.body.company_name,
  });

  try {
    if (user) {
      res.send({
        responseCode: "99",
        responseDescription: `User with email: ${user.email} is already registered`,
      });
    } else {
      user = new User(
        _.pick(req.body, [
          "first_name",
          "last_name",
          "role",
          "country",
          "email",
          "password",
        ])
      );

      if (
        existingCompany !== null &&
        req.body.company_name.toUpperCase() == existingCompany.company_name
      ) {
        return res.send({
          responseCode: "99",
          responseDescription: `Kindly contact your admin to add you as member of ${existingCompany.company_name}`,
        });
      } else {
        user.isAdmin = true;
        user.isSeller = true;
        user.isBuyer = true;
        user.isInvited = false;
        user.isVerified = false;

        let company = new Company();
        company.company_name = req.body.company_name;
        company.country = req.body.country;
        company.email = req.body.email;

        await company.save();
        user.company = company._id;
      }

      //GENERATING ACTIVATION TOKEN
      const token = generateVerifyToken(req.body.email);

      //storing the token in db
      user.confirmationCode = token;

      //hashing the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();

      // SEND THE USER A VERIFICATION EMAIL
      const url = `${process.env.VERIFICATION_URL}`;

      const compose =
        `Hello ${user.first_name + " " + user.last_name} <br><br>` +
        ` Please Activate your account by clicking on the following link<br><br>` +
        `<h5><a style="color: #ee491f;" href="${url}/api/users/verifyEmail/${token}">Click here</a></h5><br> ` +
        `<p>Thank you for joining <span style="color: #ee491f;"><b>Oktio</b></span> and we look forward to seeing you onboard.</p>` +
        `Best Regards, <br/> OKTIO Team`;

      const mailOptions = {
        from: "noreply@otkio.com", // sender address
        to: `${user.email}`, // list of receivers
        subject: "Account Confirmation", // Subject line
        html: `${compose}`, // html body
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.send({
        responseCode: "00",
        responseDescription: "Kindly check your email for confirmation link",
      });
    }
  } catch (ex) {
    console.log(ex.message);
  }
});

router.patch("/changePassword/:userId", [authGuard], async (req, res) => {
  let user = await User.findById(req.params.userId);
  // console.log(user);
  if (user) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.new_password, salt);
    user.save();

    res.send({
      responseCode: "00",
      responseDescription: "User password updated Successfully",
    });
  } else {
    res.send({
      responseCode: "99",
      responseDescription: `User with id ${req.params.id} does not exist`,
    });
  }
});

router.get("/verifyEmail/:confirmationCode", async (req, res) => {
  await User.findOne({
    confirmationCode: req.params.confirmationCode,
  }).then((userFound) => {
    try {
      if (userFound && userFound.status === "Pending") {
        userFound.status = "Active";
        userFound.isVerified = "Active";
        userFound.save();
        res.send({
          ResponseCode: "00",
          ResponseDescription: "Account Activated Successfuly",
        });
      } else if (userFound && userFound.status == "Active") {
        res.send({
          ResponseCode: "03",
          ResponseDescription: "Account already Activated",
        });
      } else {
        res.send({
          ResponseCode: "99",
          ResponseDescription: "Invalid Activation Code",
        });
      }
    } catch (ex) {
      console.log(ex.message);
    }
  });
});

router.post("/ResendConfirmationCode", async (req, res) => {
  await User.findOne({ email: req.body.email }).then((userFound) => {
    try {
      if (!userFound) {
        res.send({
          ResponseCode: "03",
          ResponseDescription: `User with ${req.body.email} does not exist`,
        });
      } else if (userFound && userFound.status == "Active") {
        res.send({
          ResponseCode: "99",
          ResponseDescription: "Account already Verified",
        });
      } else {
        const token = userFound.confirmationCode;
        const url = `${process.env.VERIFICATION_URL}/api/users/verifyEmail/${token}`;
        const compose =
          `Hello ${userFound.first_name + " " + userFound.last_name} <br><br>` +
          ` Please Activate your account by clicking on the following link<br><br>` +
          `<h5><a style="color: #ee491f;" href="${url}">Click here</a></h5><br> ` +
          `<p>Thank you for joining <span style="color: #ee491f;"><b>Oktio</b></span> and we look forward to seeing you onboard.</p>` +
          `Best Regards, <br/> OKTIO Team`;

        const mailOptions = {
          from: "noreply@otkio.com", // sender address
          to: `${userFound.email}`, // list of receivers
          subject: "Account Confirmation", // Subject line
          html: `${compose}`, // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        res.send({
          responseCode: "00",
          responseDescription: "Kindly check your email for confirmation link",
        });
      }
    } catch (ex) {
      console.log(ex.message);
    }
  });
});

router.post("/verifyForgetPassword", async (req, res) => {
  await User.findOne({ email: req.body.email }).then((userFound) => {
    try {
      if (!userFound) {
        res.send({
          ResponseCode: "03",
          ResponseDescription: `User with ${req.body.email} does not exist`,
        });
      } else {
        const token = userFound.confirmationCode;
        const url = `${process.env.VERIFICATION_URL}/verifyForgetPassword/${token}`;
        const compose =
          `Hello ${userFound.first_name + " " + userFound.last_name} <br><br>` +
          ` Kindly reset your password by clicking on the following link<br><br>` +
          `<h5><a style="color: #ee491f;" href="${url}">Click here</a></h5><br> ` +
          `<p>Thank you for joining <span style="color: #ee491f;"><b>Oktio</b></span> and we look forward to seeing you again onboard.</p>` +
          `Best Regards, <br/> OKTIO Team`;

        const mailOptions = {
          from: "noreply@otkio.com", // sender address
          to: `${userFound.email}`, // list of receivers
          subject: "Forget Password Confirmation", // Subject line
          html: `${compose}`, // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        res.send({
          responseCode: "00",
          responseDescription:
            "Kindly check your email for forget password link",
        });
      }
    } catch (ex) {
      console.log(ex.message);
    }
  });
});

router.patch("/:passwordConfirmationCode", async (req, res) => {
  let user = await User.findOne({
    confirmationCode: req.params.passwordConfirmationCode,
  });
  if (user) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.new_password, salt);
    user.save();
    res.send({
      ResponseCode: "00",
      ResponseDescription: "Password reset Successfuly",
    });
  } else {
    res.send({
      ResponseCode: "99",
      ResponseDescription: "Invalid Reset Code",
    });
  }
});

module.exports = router;
