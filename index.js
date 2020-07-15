const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const connection = require("./config");

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.send("Bienvenue sur Express");
});

app.get("/form", (req, res) => {
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

app.post("/form", (req, res) => {
  const formData = req.body;
  formData.status = "A rappeler";
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
});

app.delete("/form/:id", (req, res) => {
  const idUser = req.params.id;
  connection.query("DELETE FROM user WHERE id= ?", idUser, (err) => {
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
  const idUser = req.params.id;
  const formData = req.body;
  formData.Status = "A rappeler";
  connection.query(
    "UPDATE user SET ? WHERE id= ?",
    [formData, idUser],
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
