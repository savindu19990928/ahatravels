const express = require('express');
const path = require('path');
const app = express();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const helmet = require('helmet');
const compression = require('compression');

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(compression());

app.use(express.json({
  limit: '1mb'
}));
app.use(express.urlencoded({ extended: true }));

const oauth2Client = new google.auth.OAuth2(
  '289331454238-s92sd0iq5k955c7t9hncab9gdflr5ovf.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);


oauth2Client.setCredentials({
  refresh_token: '1//04ad89XCEDVE-CgYIARAAGAQSNwF-L9Ir-e3RZ3gGy3fbqUfq-NWEYjWNPYuJ99YbJIPAot07Ri8hjEdUnlOdM0V93XmHLhP-FDs',
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'travelsaha04@gmail.com',
    clientId: '289331454238-s92sd0iq5k955c7t9hncab9gdflr5ovf.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04ad89XCEDVE-CgYIARAAGAQSNwF-L9Ir-e3RZ3gGy3fbqUfq-NWEYjWNPYuJ99YbJIPAot07Ri8hjEdUnlOdM0V93XmHLhP-FDs',
    accessToken: oauth2Client.getAccessToken()
  },
});

async function sendEmail(message) {
  const mailOptions = {
    from: 'travelsaha04@gmail.com',
    to: 'howdysupun@gmail.com',
    subject: 'Bus Booked',
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

app.use('/assets', express.static('assets'));

app.get('/f2', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/form2.html'));
});

app.get('/q1', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/customerq1.html'));
});

app.get('/thank', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/thank.html'));
});

app.get('/nonac', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/landing2.html'));
});

app.post('/nonacbus', function (req, res) {
  let date_time = req.body.date;
  const seats = req.body.seats;

  date_time = encodeURIComponent(date_time);

  let redirectURl = `/f2?bustype=ac&datetime=${date_time}&seats=${seats}`

  return res.redirect(redirectURl);
});

app.get('/b1', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/bye.html'));
});

app.post('/bookbus', function (req, res) {
  let bustype = req.body.bustype;
  const email = req.body.email;
  const phone = req.body.number;
  const date_time = req.body.datetime;
  const seats = req.body.seats;

  if (bustype == 'ac') {
    bustype = "A/C"
  }
  else if (bustype == 'nonac') {
    bustype = 'Non A/C'
  };

  const message = `
  Bus type = ${bustype}, E-mail = ${email} 
  Phone No. = ${phone} 
  Date and time = ${date_time} 
  Number of seats = ${seats}
  `

  sendEmail(message);

  return res.redirect('/thank');
});

app.get('/ac', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/landing1.html'));
});

app.post('/acbus', function (req, res) {
  let date_time = req.body.date;
  const seats = req.body.seats;

  date_time = encodeURIComponent(date_time);

  let redirectURl = `/f2?bustype=ac&datetime=${date_time}&seats=${seats}`

  return res.redirect(redirectURl);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/customerq2.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname + '/assets/404-v2.html'));
});

app.listen(process.env.PORT || 3000);