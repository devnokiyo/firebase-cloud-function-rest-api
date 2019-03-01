const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

admin.initializeApp();
app.get('/:user_id', (req, res) => {
  const ref = admin.database().ref('users');
  ref.orderByChild('user_id').equalTo(req.params.user_id)
    .once('value').then(data => {
      return res.send(data);
    })
    .catch(error => {
      res.status(404).send('No data available.');
    });
});

app.post('/', (req, res) => {
  const ref = admin.database().ref('users');
  ref.push({
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    age: Number(req.body.age)
  }).then(data => {
    return res.status(201).send(data);
  })
  .catch(error => {
    res.status(400).send(error);      
  });
});

app.put('/:id', (req, res) => {
  const ref = admin.database().ref('users');
  const updates = {};
  updates[req.params.id] = {
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    age: Number(req.body.age)
  };
  ref.update(updates).then(data => {
    return res.send(data);
  })
  .catch(error => {
    res.status(400).send(error);      
  });
});

app.delete('/:id', (req, res) => {
  const ref = admin.database().ref(`users/${req.params.id}`);
  ref.remove().then(data => {
    return res.send(data);
  })
  .catch(error => {
    res.status(400).send(error);      
  });
});

app.get('/', (req, res) => {
  const ref = admin.database().ref('users');
  ref.once('value').then(data => {
    return res.send(data);
  })
  .catch(error => {
    res.status(404).send('No data available.');
  });
});

exports.users = functions.https.onRequest(app);