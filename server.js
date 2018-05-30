const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressValidator = require("express-validator");
const bcrypt = require("bcryptjs");
const path = require("path");
const flash = require("connect-flash");

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

// Initializing app
const { DATABASE_URL, PORT, SECRET } = require("./config");
const app = express();
mongoose.Promise = global.Promise;

// Sets static public folder
app.use(express.static(path.join(__dirname, "public")));

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Express session middleware
app.use(
	session({
		secret: SECRET,
		resave: false,
		saveUninitialized: false
	})
);

// Connect Flash
app.use(flash());

// Connect Flash messages
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.info_msg = req.flash("info_msg");
	next();
});

// Express Validator
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");

app.use(expressValidator());

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// Morgan logging middleware
app.use(morgan("common"));

// Routers and modules
const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");

app.use("/login", loginRouter);
app.use("/register", registerRouter);

// Checks to see if user is authenticated to access protected routes
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	} else {
		// if they aren't redirect them to the home page
		res.redirect("/login");
	}
}

app.get("/", (req, res) => {
	res.redirect("/login");
});
// Login Screen
app.get("/login", (req, res) => {
	res.sendFile("public/login.html", { root: __dirname });
});
// Register
app.get("/register", (req, res) => {
	res.sendFile("public/register.html", { root: __dirname });
});
app.get("/auth", isLoggedIn, (req, res) => {
	res.sendFile("public/auth.html", { root: __dirname });
});

// Initializing Server
let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app
				.listen(port, () => {
					console.log(`Your app is listening on port ${port}`);
					resolve();
				})
				.on("error", err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log("Closing server");
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
