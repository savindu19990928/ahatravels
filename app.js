const express = require('express');
const path = require('path');
const app = express();

app.use('/assets', express.static('assets'));

app.get('/thank', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/thank.html'));
});

app.get('/nonac', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/landing2.html'));
});

app.post('/nonacbus', function (req, res) {
  return res.redirect('/thank');
});

app.get('/ac', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/landing1.html'));
});

app.post('/acbus', function (req, res) {
  return res.redirect('/thank');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/customerq1.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname + '/assets/404-v2.html'));
});

app.listen(process.env.PORT || 3000);