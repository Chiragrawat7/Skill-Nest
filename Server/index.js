const express = require("express");
const app = express();

require("dotenv").config();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/course");
const contactUsRoute =require('./routes/Contact')

const { dbConnect } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const port = process.env.PORT || 4000;
const fileUpload = require("express-fileupload");

dbConnect();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: '/tmp/'
}));


// cloudinary connect
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.get("/", (req, res) => {
  res.send("<h1>this is default route</h1>");
});

app.listen(port, () => {
  console.log("App is running at " + port);
});
