import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { Sequelize } from "sequelize";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import preQARoutes from "./routes/predifiendQA.js";
import allQARoutes from "./routes/allQA.js";
import questionRoutes from "./routes/question.js";
import messageRoutes from "./routes/contact.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const sequelize = new Sequelize("sqlite::memory:");

const app = express();
app.use(express.json());
const corsOptions = {
  optionsSuccessStatus: 200,
  origin: "https://mashed-bot.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/qa", preQARoutes);
app.use("/allqa", allQARoutes);
app.use("/question", questionRoutes);
app.use("/contact", messageRoutes);

// Check if the connection works by syncing with the database
sequelize
  .sync()
  .then(() => {
    console.log("Connected to database successfully!");
  })
  .catch((err) => {
    console.error(err);
  });

// create and error object,catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({
    success: false,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${PORT}!!!`
  );
});
