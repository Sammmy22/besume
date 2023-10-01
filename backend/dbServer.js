const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
app.use(cors());
require("dotenv").config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("DB connected successful: " + connection.threadId);
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Server Started on port ${port}...`));

const bcrypt = require("bcrypt");
app.use(express.json());
//middleware to read req.body.<params>
//CREATE USER
app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const githubProfile = req.body.githubProfile;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM userTable WHERE email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const sqlInsert =
      "INSERT INTO userTable(userId,email,name,password,githubProfile) VALUES (0,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      email,
      name,
      hashedPassword,
      githubProfile,
    ]);

    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      console.log("------> Search Results");
      console.log(result.length);
      if (result.length != 0) {
        connection.release();
        console.log("------> User already exists");
        res.sendStatus(409);
      } else {
        await connection.query(insert_query, (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> Created new User");
          console.log(result.insertId);
          res.sendStatus(201);
        });
      }
    });
  });
});

//LOGIN (AUTHENTICATE USER)
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from userTable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      connection.release();

      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        const user = result[0];
        const hashedPassword = user.password;
        //get the hashedPassword from result
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("---------> Login Successful");

          res.json({
            userId: user.userId,
            name: user.name,
            email: user.email,
            githubProfile: user.githubProfile,
            skills: user.skills,
            projects: user.projects,
            about: user.about,
            achievements: user.achievements,
            qualification: user.qualification,
            status: user.status,
          });
        } else {
          console.log("---------> Password Incorrect");
          res.send("Password incorrect!");
        }
      }
    });
  });
});

app.post("/edit", async (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const email = req.body.email;
  const githubProfile = req.body.githubProfile;
  const skills = req.body.skills;
  const projects = req.body.projects;
  const about = req.body.about;
  const achievements = req.body.achievements;
  const qualification = req.body.qualification;
  const status = req.body.status;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const update_query = mysql.format(
      "UPDATE userTable SET name = ?, githubProfile = ?, skills = ?, projects = ?, about = ?, achievements = ?, qualification = ?, status = ? WHERE userId = ?",
      [
        name,
        githubProfile,
        skills,
        projects,
        about,
        achievements,
        qualification,
        status,
        userId,
      ]
    );

    console.log(update_query);

    await connection.query(update_query, async (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        console.log(result);
        console.log("user updated");

        const updatedUserQuery = mysql.format(
          "Select * from userTable where email = ?",
          [email]
        );

        await connection.query(updatedUserQuery, (err, updatedResult) => {
          if (err) throw err;
          const updatedUser = updatedResult[0];
          res.json(updatedUser);
        });
      }
    });
  });
});
