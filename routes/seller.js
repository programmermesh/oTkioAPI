const { generateVerifyToken } = require("../middleware/auth");
const { transporter } = require("../middleware/sendEmail");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateSeller } = require("../models/user");
const { SupplierCompany } = require("../models/supplierCompany");
const { Auction } = require("../models/auction");
const express = require("express");
const router = express.Router();

router.post("/auctionInvitation", async (req, res) => {
  const { error } = validateSeller(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let seller = await User.findOne({
    email: req.body.email,
  });

  try {
    if (seller === null) {
      seller = new User(
        _.pick(req.body, [
          "email",
          "buyerUserId",
          "company_buyer_name",
          "auctionId",
        ])
      );
      seller.isSeller = true;
      seller.isBuyer = true;
      seller.isInvited = true;
      seller.isVerified = false;

      //GENERATING ACTIVATION TOKEN
      const token = generateVerifyToken(req.body.email);

      //storing the token in db
      seller.confirmationCode = token;

      //hashing the password
      const salt = await bcrypt.genSalt(10);
      seller.password = await bcrypt.hash(req.body.email, salt);

      await seller.save();

      // SEND THE SELLER A VERIFICATION EMAIL
      const url = `${process.env.VERIFICATION_URL}`;

      const compose =
        `Hello! <br><br> You have been invited to be part of an auction by <b>${seller.company_buyer_name.toUpperCase()}</b>.<br><br>` +
        `Kindly login to OKTIO to accept the invitation.<br>` +
        `Use your email "${seller.email}" as your email and password (No registration needed).` +
        `<h5><a style="color: #ee491f;" href="${url}/verifySellerEmail/${token}">Click here</a></h5><br> ` +
        `<p>Thank you for joining <span style="color: #ee491f;"><b>Oktio</b></span> and we look forward to seeing you onboard.</p>` +
        `Best Regards, <br/> OKTIO Team`;

      const mailOptions = {
        from: "noreply@otkio.com", // sender address
        to: `${seller.email}`, // list of receivers
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
        responseDescription: "Invitation sent successfully",
      });
    }
    //Comparing the items in the seller's auctionId column

    for (let i = 0; i < seller.auctionId.length; i++) {
      if (seller && seller.auctionId[i] === req.body.auctionId) {
        return res.send({
          responseCode: "99",
          responseDescription: `Seller with email: ${seller.email} is already invited`,
        });
      }
      if (seller && seller.auctionId[i] != req.body.auctionId) {
        seller.auctionId.push(req.body.auctionId);
        seller.isVerified = true;
        await seller.save();

        // SEND THE SELLER A NOTIFICATION EMAIL
        const url = `${process.env.VERIFICATION_URL}`;

        const compose =
          `Hello! <br><br> You have been invited to be part of an auction by <b>${seller.company_buyer_name.toUpperCase()}</b>.<br><br>` +
          `Kindly login to OKTIO to see auction.<br>` +
          `<h5><a style="color: #ee491f;" href="${url}">Click here</a></h5><br> ` +
          `<p>Thank you for joining <span style="color: #ee491f;"><b>Oktio</b></span> and we look forward to seeing you onboard.</p>` +
          `Best Regards, <br/> OKTIO Team`;

        const mailOptions = {
          from: "noreply@otkio.com", // sender address
          to: `${seller.email}`, // list of receivers
          subject: "Auction Notification", // Subject line
          html: `${compose}`, // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        return res.send({
          responseCode: "00",
          responseDescription: `Auction Notification email sent successfully`,
        });
      }
    }
  } catch (ex) {
    console.log(ex.message);
  }
});

router.post("/getCompanyInvitation", async (req, res) => {
  let seller = await SupplierCompany.find({
    email: req.body.email,
  });

  seller.length <= 0
    ? res
        .status(400)
        .send({ responseCode: "99", responseDescription: `No record found` })
    : res.status(200).send({
        seller,
        responseCode: "00",
        responseDescription: `Succesfull`,
      });
});

router.post("/getCompanyAcceptedInvitation", async (req, res) => {
  let seller = await SupplierCompany.find({
    email: req.body.email,
  })
    .where("invitation")
    .equals("Accepted");
  res.send({
    seller,
    responseCode: "00",
    responseDescription: `Succesfull`,
  });
});

router.patch("/acceptorDeclineCompanyInvitation", async (req, res) => {
  let seller = await SupplierCompany.findOne({
    _id: req.body.id,
  });

  if (seller) {
    try {
      seller = await seller.updateOne({
        $set: {
          invitation: req.body.invitation,
        },
      });
      res.send({
        seller,
        responseCode: "00",
        responseDescription: `Company invitation ${req.body.invitation} Successfully`,
      });
    } catch (ex) {
      console.log(ex.message);
    }
  }
});

router.post("/declineCompanyInvitation", async (req, res) => {
  let seller = await SupplierCompany.findOne({
    _id: req.body.id,
  });

  if (seller) {
    try {
      seller = await seller.updateOne({
        $set: {
          invitation: "Declined",
        },
      });
      res.send({
        seller,
        responseCode: "00",
        responseDescription: "Company invitation declined Successfully",
      });
    } catch (ex) {
      console.log(ex.message);
    }
  }
});

router.get("/:confirmationCode", async (req, res) => {
  await User.findOne({
    confirmationCode: req.params.confirmationCode,
  }).then((userFound) => {
    try {
      if (userFound && userFound.status === "Pending") {
        userFound.status = "Active";
        userFound.isVerified = true;
        userFound.save();
        res.send({
          ResponseCode: "00",
          ResponseDescription: "Account Activated Succesfully",
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

router.get("/getAllMyAuctions/:email", async (req, res) => {
  const auction = await Auction.find({
    sellersEmail: { $elemMatch: { $eq: req.params.email } },
  })
    .select("-_id project_type company_buyer_name userId")
    .then((auctions) => {
      if (!auctions) {
        return res
          .status(400)
          .send({ responseCode: "99", responseDescription: `No record found` });
      } else {
        return res.status(200).send({
          auctions,
          responseCode: "00",
          responseDescription: `Succesfull`,
        });
      }
    });
});

module.exports = router;
