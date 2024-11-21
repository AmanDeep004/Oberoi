const https = require("http");
const express = require("express");
const mongoose = require("mongoose");
// const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const { check, validationResult } = require("express-validator");
require("dotenv").config();

const logging = require("./helpers/logging");
const homeRouter = require("./routes/home");
const adminRouter = require("./routes/admin");

const newFoodCategoryRouter = require("./routes/newFoodCategory");
const newFoodItemRouter = require("./routes/newFoodItem");
const newFoodpackageRouter = require("./routes/newFoodPackage");
const decorItemRouter = require("./routes/decorItem");
const decorCategoryRoute = require("./routes/decorCategory");
const entertainmentItemRoute = require("./routes/entertainmentItem");
const entertainmentCategoryRoute = require("./routes/entertainmentCategory");
const authOTP = require("./routes/authOTP");
const UserRequirementRouter = require("./routes/userRequirement");

const NAMESPACE = "APP";

const app = express();

/**Administration route */
const administratorRouter = require("./routes/administrator");
/**User route */
const userRouter = require("./routes/user");

const mongoString = process.env.MONGO_CON;
const serverPort = process.env.SERVER_PORT;
/** Connect to MongoDB */
mongoose
  .connect(mongoString)
  .then((result) => {
    logging.info(NAMESPACE, "MongoDB connection", "Connected to mongoDB!");
    console.log("Connected to mongoDB!");
    app.listen(serverPort, () => {
      console.log(`Server Started at localhost:${serverPort}`);
    });
  })
  .catch((error) => {
    logging.error(NAMESPACE, "MongoDB connection", error);
  });

//middlewares

//body parser middleware to get the cookies.
app.use(express.json({ limit: "150mb" }));
app.use(bodyParser.json());

app.options("*", cors());

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: true }));
app.set("view engine", "ejs");
// app.use('/assets', express.static(path.join(__dirname + '/assets/')));
// app.set('views', [path.join(__dirname + '/views/'), path.join(__dirname + '/views/home/'), path.join(__dirname + '/views/admin/'), path.join(__dirname + '/views/layout/')]);
// app.use(favicon(__dirname + '/favicon.ico'));
// app.use(expressLayouts);
// app.set('layout', path.join(__dirname + '/views/layout/_layout'));
// app.set('layout extractScripts', true);
//cookie parser middleware to get the cookies
app.use(cookieParser());

//session middleware
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );

//   if (req.method == "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST PUT");
//     return res.status(200).json({});
//   }

//   next();
// });

//** Pass Session variables to views */
app.use(function (req, res, next) {
  //setiing the Global variable here
  if (req.session.loggedInUser) {
    res.locals.sideMenu = req.session.sideMenu;
    res.locals.user = req.session.loggedInUser;
  }
  next();
});

// app.use(interaction);

//Routes
app.use("/", homeRouter);
//app.use("/admin", adminRouter);
app.use("/authOTP", authOTP);

app.use("/decor/category", decorCategoryRoute);
app.use("/decor/item", decorItemRouter);

app.use("/entertainment/category", entertainmentCategoryRoute);
app.use("/entertainment/item", entertainmentItemRoute);

app.use("/food/category", newFoodCategoryRouter);
app.use("/food/item", newFoodItemRouter);
app.use("/food/package", newFoodpackageRouter);
app.use("/useRequirement", UserRequirementRouter);

/**admin part implementation */
app.use("/administrator", administratorRouter);

/**user part implementation */
app.use("/user", userRouter)

/** Error Handling */
app.use((req, res, next) => {
  const error = new Error("Bad Request");

  return res.status(404).json({
    statusCode: 404,
    message: error.message,
  });
});
