const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

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

app.get("/users", (req, res) => {
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
  const user = req.body.username;
  connection.query(
    "SELECT username from user where username= ?",
    user,
    (req, res) => {
      if (null) {
        return res.status(400).send("cannot find user");
      } else {
        return res.status(200).send("ok");
      }
    }
  );
  // const user = users.find((user) => (user.name = req.body.name));
  // if (user == null) {
  //   return res.status(400).send("cannot find user");
  // }
  // try {
  //   if (await bcrypt.compare(req.body.password, user.password)) {
  //     res.send("success");
  //   } else {
  //     res.send("not allowed");
  //   }
  // } catch {
  //   res.status(500).send();
  // }
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
