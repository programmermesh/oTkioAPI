const { generateVerifyToken, authGuard, admin } = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { transporter } = require("../middleware/sendEmail");
const { Company } = require("../models/company");
const { User, validateCompanyTeamMembers } = require("../models/user");
const {
  CompanySupplier,
  validateCompanySupplier,
} = require("../models/companySupplier");
const {
  BusinessUnit,
  validateBusinessUnit,
} = require("../models/businessUnit");
const { SupplierCompany } = require("../models/supplierCompany");
const express = require("express");
const router = express.Router();

router.get("/profile/:companyId", async (req, res) => {
  const company = await Company.findById(req.params.companyId).select(
    "_id image_upload company_name country city address email website mobile createdDate"
  );

  console.log(company);

  return res.status(200).send({
    company,
    responseCode: "00",
    responseDescription: `Successful`,
  });
});

router.get("/:companyId/members", [authGuard, admin], async (req, res) => {
  const companyTeamMembers = await User.find({
    company: req.params.companyId,
  })
    .sort("first_name")
    .select("_id first_name last_name role isSeller isBuyer email status");

  companyTeamMembers.length <= 0
    ? res
        .status(400)
        .send({ responseCode: "99", responseDescription: `No record found` })
    : res.status(200).send({
        companyTeamMembers,
        responseCode: "00",
        responseDescription: `Succesfull`,
      });
});

router.get(
  "/suppliers/:getAllCompanySuppliersByCompanyName",
  [authGuard, admin],
  async (req, res) => {
    const companySuppliers = await CompanySupplier.find({
      company_buyer_name: req.params.getAllCompanySuppliersByCompanyName,
    });

    companySuppliers.length <= 0
      ? res
          .status(400)
          .send({ responseCode: "99", responseDescription: `No record found` })
      : res.status(200).send({
          companySuppliers,
          responseCode: "00",
          responseDescription: `Succesfull`,
        });
  }
);

router.get("/getBusinessUnits/:companyId", async (req, res) => {
  const businessUnits = await BusinessUnit.find({
    companyId: req.params.companyId,
  }).select("_id name createdDate");
  // console.log(businessUnits);
  businessUnits.length <= 0
    ? res
        .status(400)
        .send({ responseCode: "99", responseDescription: `No record found` })
    : res.status(200).send({
        businessUnits,
        responseCode: "00",
        responseDescription: `Succesfull`,
      });
});

router.patch(
  "/editCompany/:companyId",
  [authGuard, admin],
  async (req, res) => {
    let company = await Company.findById(req.params.companyId);
    if (company) {
      try {
        company.image_upload = req.body.image_upload;
        company.company_name = req.body.company_name;
        company.country = req.body.country;
        company.city = req.body.city;
        company.address = req.body.address;
        company.email = req.body.email;
        company.website = req.body.website;
        company.mobile = req.body.mobile;

        company = await company.save();
        res.send({
          company,
          responseCode: "00",
          responseDescription: "Company updated Successfully",
        });
      } catch (ex) {
        console.log(ex.message);
      }
    } else {
      res.send({
        responseCode: "99",
        responseDescription: `Company with id ${req.params.companyId} does not exist`,
      });
    }
  }
);

router.patch(
  "/:companyId/editMember/:userId",
  [authGuard, admin],
  async (req, res) => {
    let member = await User.findById(req.params.userId);

    if (member) {
      try {
        member = await member.updateOne({
          $set: {
            isSeller: req.body.isSeller,
            isBuyer: req.body.isBuyer,
            role: req.body.role,
            position: req.body.position,
            isAdmin: req.body.isAdmin,
          },
        });
        res.send({
          member,
          responseCode: "00",
          responseDescription: "Company Team member Role updated Successfully",
        });
      } catch (ex) {
        console.log(ex.message);
      }
    } else {
      res.send({
        responseCode: "99",
        responseDescription: `Company Team member with id ${req.params.id} does not exist`,
      });
    }
  }
);

router.patch("/editBusinessUnit/:id", [authGuard, admin], async (req, res) => {
  let businessUnit = await BusinessUnit.findById(req.params.id);
  if (businessUnit) {
    businessUnit.name = req.body.name;
    businessUnit.updatedBy = req.body.userId;

    businessUnit = await businessUnit.save();
    res.send({
      businessUnit,
      responseCode: "00",
      responseDescription: `Business unit updated Successfully`,
    });
  } else {
    res.send({
      responseCode: "99",
      responseDescription: `Business unit with id ${req.body._id} does not exist`,
    });
  }
});

router.post("/:companyId/addMember", [authGuard, admin], async (req, res) => {
  const { error } = validateCompanyTeamMembers(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
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
          "position",
          "email",
          "isAdmin",
          "isSeller",
          "isBuyer",
        ])
      );
    }

    //GENERATING ACTIVATION TOKEN
    const token = generateVerifyToken(req.body.email);

    //storing the token in db
    user.confirmationCode = token;

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.email, salt);
    user.company = req.params.companyId;
    user.status = "Active";
    user.isInvited = true;
    user.isVerified = true;

    await user.save();

    // SEND THE USER A VERIFICATION EMAIL
    const url = `${process.env.VERIFICATION_URL}`;
    console.log(user.email);
    const compose =
      `Hello ${user.first_name + " " + user.last_name} <br><br>` +
      ` You have been invited to be a team member by ${req.body.company_name} <br><br>` +
      ` Your email is your login email and password, you can change your password when you login. <br>` +
      ` Login to  your account using the below link, <br><br>` +
      `<h5><a style="color: #ee491f;" href="${url}">Click here</a></h5><br> ` +
      `<p>Thank you for joining <span style="color: #ee491f;"><b>Oktio</b></span> and we look forward to seeing you onboard.</p>` +
      `Best Regards, <br/> OKTIO Team`;

    const mailOptions = {
      from: "noreply@otkio.com", // sender address
      to: `${user.email}`, // list of receivers
      subject: "Member Invite", // Subject line
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
      responseDescription: "An invite mail has been sent successfully.",
    });
  } catch (ex) {
    console.log(ex.message);
  }
});

router.post("/addSupplierToCompany", [authGuard, admin], async (req, res) => {
  const { error } = validateCompanySupplier(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let supplier = await User.findOne({
    email: req.body.email,
  });

  try {
    if (supplier) {
      const cSupplier = new CompanySupplier();
      cSupplier.first_name = supplier.first_name;
      cSupplier.last_name = supplier.last_name;
      cSupplier.role = supplier.role;
      cSupplier.email = supplier.email;
      cSupplier.company_name = supplier.company_name;
      cSupplier.country = supplier.country;
      cSupplier.isAdmin = supplier.isAdmin;
      cSupplier.isSeller = supplier.isSeller;
      cSupplier.isBuyer = supplier.isBuyer;
      cSupplier.status = supplier.status;
      cSupplier.company_buyer_name = req.body.company_buyer_name;
      cSupplier.buyerUserId = req.body.buyerUserId;

      await cSupplier.save();

      const supplierC = new SupplierCompany();
      supplierC.email = req.body.email;
      supplierC.company_buyer_name = req.body.company_buyer_name;
      supplierC.buyerUserId = req.body.buyerUserId;

      await supplierC.save();

      // SEND THE SUPPLIER AN INVITATION EMAIL
      const url = `${process.env.VERIFICATION_URL}`;

      const compose =
        `Hello ${supplier.first_name + " " + supplier.last_name} <br><br>` +
        ` You have been invited to be part of a supplier by ${req.body.company_buyer_name} <br><br>` +
        ` Kindly login to Accept or Decline request by clicking on the link below<br><br>` +
        `<h5><a style="color: #ee491f;" href="${url}">Click here</a></h5><br> ` +
        `<p>Thank you for joining <span style="color: #ee491f;"><b>Oktio</b></span> and we look forward to seeing you onboard.</p>` +
        `Best Regards, <br/> OKTIO Team`;

      const mailOptions = {
        from: "contact@oktio.io", // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "Supplier Invitation", // Subject line
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
        responseDescription: `Invitation email sent and awaiting acceptance`,
      });
    } else {
      const cSupplier = new CompanySupplier();
      cSupplier.email = req.body.email;
      cSupplier.company_buyer_name = req.body.company_buyer_name;
      cSupplier.buyerUserId = req.body.buyerUserId;

      await cSupplier.save();

      // SEND THE SUPPLIER AN INVITATION EMAIL TO CREATE ACCOUNT
      const url = `${process.env.VERIFICATION_URL}`;

      const compose =
        `Hello!!! <br><br>` +
        ` You have been invited to be part of a supplier by ${req.body.company_buyer_name} <br><br>` +
        ` Kindly login to create your account and Accept or Decline request by clicking on the link below<br><br>` +
        `<h5><a style="color: #ee491f;" href="${url}">Click here</a></h5><br> ` +
        `<p>Thank you for joining <span style="color: #ee491f;"><b>Oktio</b></span> and we look forward to seeing you onboard.</p>` +
        `Best Regards, <br/> OKTIO Team`;

      const mailOptions = {
        from: "noreply@otkio.com", // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "Supplier Invitation", // Subject line
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
        responseDescription: `Invitation email sent and awaiting acceptance`,
      });
    }
  } catch (ex) {
    console.log(ex.message);
  }
});

router.post("/addBusinessUnit", [authGuard, admin], async (req, res) => {
  const { error } = validateBusinessUnit(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let businessUnit = new BusinessUnit({
      ..._.pick(req.body, ["name", "companyId", "userId"]),
      createdBy: req.body.userId,
    });

    businessUnit = await businessUnit.save();
    res.send({
      businessUnit,
      responseCode: "00",
      responseDescription: "Business Unit created Successfully",
    });
  } catch (ex) {
    console.log(ex.message);
  }
});

router.delete(
  "/deleteSupplierFromCompany",
  [authGuard, admin],
  async (req, res) => {
    let seller = await CompanySupplier.findOne({
      _id: req.body.id,
    });

    if (seller) {
      try {
        seller = await seller.deleteOne();
        res.send({
          responseCode: "00",
          responseDescription: `Company supplier deleted Successfully`,
        });
      } catch (ex) {
        console.log(ex.message);
      }
    }
  }
);

router.delete(
  "/:companyId/deleteMember/:userId",
  [authGuard, admin],
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.send({
        member,
        responseCode: "00",
        responseDescription: "Company Team member deleted Successfully",
      });
    } catch (ex) {
      console.log(ex.message);
    }
  }
);

router.delete(
  "/deleteBusinessUnit/:id",
  [authGuard, admin],
  async (req, res) => {
    let businessUnit = await BusinessUnit.findById(req.params.id);

    if (businessUnit) {
      try {
        businessUnit = await businessUnit.deleteOne();
        res.send({
          responseCode: "00",
          responseDescription: `Company business unit deleted Successfully`,
        });
      } catch (ex) {
        console.log(ex.message);
      }
    }
  }
);

module.exports = router;
