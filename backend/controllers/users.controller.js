const asyncMySQL = require("../database/connection");
const {
  getUserId,
  checkUser,
  addUser,
  registerUserId,
} = require("../database/queries");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
require("dotenv").config();

async function loginUser(req, res) {
  console.log("login route ran");

  const { email, password } = req.body;

  if (
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    res.status(401).send("incorrect credentials");
    return;
  }

  if (email.length > 50) {
    res.status(400).send("bad request");
    return;
  }

  const userId = await asyncMySQL(getUserId(), [email]);

  try {
    const results = await asyncMySQL(checkUser(), [email]);

    if (results.length === 0) {
      res.status(404).send("no user found");
      return;
    }

    // checks password against hashed password in db
    const hashedPassword = results[0].password;

    const matchedPassword = await bcrypt.compare(password, hashedPassword);
    if (!matchedPassword) {
      res.status(401).send("Incorrect password supplied");
      return;
    }

    // signs jwt
    const token = jwt.sign(
      { userId },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          res.status(500).send("couldn't verify token");
        }
        res.status(200).send({
          userInfo: { name: results[0].name, id: results[0].user_id },
          token,
        });
      }
    );

    // Creating session for user
    req.session.user_id = results[0].user_id;
  } catch (error) {
    console.log("The error is:", error);
    res.status(500).send("There was an error");
  }
}

// registers a new user
async function registerUser(req, res) {
  console.log("register user route ran");

  const { name, email, password } = req.body;

  console.log("register route ran");
  if (
    !name ||
    typeof name !== "string" ||
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    res.status(404).send("couldn't create your account");
    return;
  }

  if (email.length > 50) {
    res.status(400).send("bad request");
    return;
  }

  // hashes password

  const encryptedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await asyncMySQL(addUser(), [name, email, encryptedPassword]);

    const user = await asyncMySQL(registerUserId(), [email]);

    //  gets user info to send back in response
    const userId = user[0].id;
    const userInfo = { name: user[0].name, email: user[0].email };

    //  jwt token signed
    const token = jwt.sign(
      { userId },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
        }
        res.status(200).send({ userInfo, token });
      }
    );
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("There was an issue creating your account");
  }
}

async function logout(req, res) {
  try {
    // closes express session
    req.session.destroy((err) => {
      if (err) {
        res.sendStatus(500).json("couldn't log out");
        return;
      } else {
        res.status(200).send("logged out");
      }
    });
  } catch (error) {
    console.log("There was an error:", error);
    res.status(500).send("couldn't log out");
    return;
  }
}

module.exports = {
  loginUser,
  registerUser,
  logout,
};
