require("dotenv").config();
const mongoose = require("mongoose");
const users = require("./routes/users");
const subscriptions = require("./routes/subscriptions");
const auth = require("./routes/auth");
const buyer = require("./routes/buyer");
const seller = require("./routes/seller");
const company = require("./routes/company");
const express = require("express");
const cors = require("cors");
const app = express();

//Swagger documentation
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");

//Connect to database
mongoose
  .connect("mongodb://localhost/okTioDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to Database..."))
  .catch((err) => console.error("Could not connect to Databasee...", err));

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

//Routes
app.use("/api/users", users);
app.use("/forgetPassword", users);
app.use("/api/subscriptions", subscriptions);
app.use("/api/auth", auth);
app.use("/api/buyer", buyer);
app.use("/api/buyer/item", buyer);
app.use("/api/seller", seller);
app.use("/verifySellermail", seller);
app.use("/api/company", company);
app.use("/api/company/profile", company);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
