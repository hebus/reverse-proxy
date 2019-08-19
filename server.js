const express = require('express');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json();
const apiUrl = 'http://localhost:8080';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.options('*', cors());
app.put('*', jsonParser, (req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl, req.body);
  request({
    url: apiUrl + req.originalUrl,
    method: 'PUT',
    json: req.body
  },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log('error:', error, response);
        return res.status(500).json({ type: 'error', error });
      }
      res.json(body);
    }
  );
});

app.all('*', (req, res) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  request(
    { url: apiUrl + req.originalUrl, json: JSON.stringify(req.body) },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log('error:', error);
        return res.status(500).json({ type: 'error', error });
      }

      res.json(JSON.parse(body));
    }
  )
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`listening on ${PORT}`));