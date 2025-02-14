const path = require("node:path");
const express = require("express");
const session = require("express-session");
require("dotenv").config();
const CURouter = require("./routes/create_user_router");
const LIRouter = require("./routes/login_router");
const SPRouter = require("./routes/secret_password_router");
const passport = require("./auth");
const links = require("./links");
const APRouter = require("./routes/all_post_router");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "test", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", APRouter.getAllPosts);
app.post("/create-post", APRouter.createPost);
app.post("/delete-post", APRouter.deletePost);

app.get("/create-user", CURouter.getCreateUserPage);
app.post("/create-user", CURouter.postNewUser);

app.get("/login", LIRouter.getLoginPage);
app.post("/login", LIRouter.postLoginPage);
app.get("/logout", LIRouter.logout);
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

app.get("/secret-word", SPRouter.getSPWPage);
app.post("/secret-word", SPRouter.postSPWPage);

app.listen(3000, () => console.log("app listening on port 3000!"));