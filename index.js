const express = require('express');
const app = express();
const port = 5000;

const connection = require('./config');


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', (request, response) => {
  response.send('Bienvenue sur Express');
});

app.get('/form', (req, res) => {
  connection.query('SELECT * from clients', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des données');
    } else {
      res.json(results);
    }
  });
});


app.post('/form', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO clients SET ?', formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de l'enregistrement de vos données");
    } else {
      res.sendStatus(200);
    }
  });
});



app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});

