const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const { authToken } = require("./middlewares");

const connection = require("./config");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

app.use(express.json());

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const users = [];

app.get("/users", authToken("admin"), (req, res) => {
  connection.query("SELECT * from user", (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Erreur lors de l'enregistrement de vos données",
        error: err,
      });
    } else {
      res.json(results);
    }
  });
});

app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const formData = req.body;
    formData.password = hashedPassword;
    formData.role = "admin";
    connection.query("INSERT INTO user SET ?", formData, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Erreur lors de l'enregistrement de vos données",
          error: err,
        });
      } else {
        res.sendStatus(201);
      }
    });
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  connection.query(
    "SELECT * from user WHERE username= ?",
    req.body.username,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({ msg: err });
      }
      if (!result.length) {
        return res.status(401).send({ msg: "Username is incorrect" });
      }

      bcrypt.compare(req.body.password, result[0].password, (bErr, bResult) => {
        let bool = bcrypt.compareSync(req.body.password, result[0].password);
        console.log(bool);
        console.log(result[0].password);
        console.log(req.body.password);
        if (bool == false) {
          return res.status(401).send({ msg: "password is incorrect" });
        }
        if (bool == true) {
          const token = jwt.sign(
            {
              username: result[0].username,
              role: result[0].role,
              id: result[0].id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: 50,
            }
          );
          return res.status(200).send({
            token,
            msg: "logged in",
            user: result[0],
          });
        }
      });
    }
  );
});

app.get("/", (request, response) => {
  response.send("Bienvenue sur Express");
});

app.get("/form", (req, res) => {
  connection.query("SELECT * from client", (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Erreur lors de l'enregistrement de vos données",
        error: err,
      });
    } else {
      res.json(results);
    }
  });
});

app.post("/form", (req, res) => {
  const formData = req.body;
  formData.status = "A rappeler";
  connection.query("INSERT INTO client SET ?", formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "Erreur lors de l'enregistrement de vos données",
        error: err,
      });
    } else {
      res.sendStatus(201);
    }
  });
});

app.delete("/form/:id", (req, res) => {
  const idClient = req.params.id;
  connection.query("DELETE FROM client WHERE id= ?", idClient, (err) => {
    if (err) {
      res.status(500).json({
        message: "erreur",
        error: err,
      });
    } else {
      res.sendStatus(201);
    }
  });
});

app.put("/form/:id", (req, res) => {
  const idClient = req.params.id;
  const formData = req.body;
  formData.Status = "A rappeler";
  connection.query(
    "UPDATE client SET ? WHERE id= ?",
    [formData, idClient],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Erreur lors de l'enregistrement de vos données",
          error: err,
        });
      } else {
        res.sendStatus(201);
      }
    }
  );
});

app.listen(port, (err) => {
  if (err) {
    throw new Error("Something bad happened...");
  }

  console.log(`Server is listening on ${port}`);
});
