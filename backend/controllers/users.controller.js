const asyncMySQL = require("../database/connection");

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
    res.send("incorrect credentials");
    return;
  }

  const userId = await asyncMySQL(`SELECT user_id FROM users
                                      WHERE email = '${email}';`);

  try {
    const results = await asyncMySQL(`SELECT password, user_id
      FROM users
      WHERE email = '${email}';`);

    if (results.length === 0) {
      res.send("no user found");
      return;
    }

    const hashedPassword = results[0].password;

    const matchedPassword = await bcrypt.compare(password, hashedPassword);
    if (!matchedPassword) {
      res.status(404).send("Incorrect password supplied");
      return;
    }

    // TODO: use something better than email, userId
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
        res.status(404);
      }
    );
    // Creating session for user
    req.session.user_id = results[0].user_id;
    console.log("success!");
    res.status(200).send({ results, token });
  } catch (error) {
    console.log("The error is:", error);
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

  const encryptedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await asyncMySQL(`INSERT INTO users 
    (name, email, password)
    VALUES
    ('${name}', '${email}', '${encryptedPassword}')`);

    const user = await asyncMySQL(`SELECT user_id FROM users
                                         WHERE email = '${email}';`);

    const userId = user[0].id;

    // res.send(token);
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
        res.status(200).send(token);
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
        res.redirect("/");
      }
    });
    // clears json web token
    res.clearCookie("jwtToken");
  } catch (error) {
    console.log("There was an error:", error);
    res.sendStatus(500).json("couldn't log out");
    return;
  }
}

module.exports = {
  loginUser,
  registerUser,
  logout,
};
