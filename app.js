const express = require('express');
const path = require('path');
const surveyController = require('./surveyController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from project root (styles, images, script.js)
app.use(express.static(__dirname));

surveyController(app);

module.exports = app;
