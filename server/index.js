const express = require("express");
const bodyParser = require("body-parser");
const Pusher = require("pusher");
const cors = require("cors");
const mustacheExpress = require('mustache-express');

const { check } = require('express-validator/check')

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER
});

var users = []; // this will store the username and scores for each user

app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  const auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  console.log(username + " logged in");

  if (users.indexOf(username) === -1) {
    console.log('users: ', users.length);
    users.push({
      username,
      score: 0
    });
  }

  res.send('ok');
});

app.get("/create-quiz", (req, res) => {
  res.render('quiz_creator', { msg: "test" });
});

const required = { min: 1 };

app.post("/save-item", [
  check('question').isLength(required),
  check('option_a').isLength(required),
  check('option_b').isLength(required),
  check('option_c').isLength(required),
  check('option_d').isLength(required),
  check('answer').isLength(required)
], (req, res) => {

  const { question, option_a, option_b, option_c, option_d, answer } = req.body;
  db.serialize(() => {
    var stmt = db.prepare('INSERT INTO quiz_items VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run([question, option_a, option_b, option_c, option_d, answer]);
  });

  res.redirect('/create-quiz#ok');
});

app.get("/create-db", (req, res) => {
  db.serialize(() => {
    db.run('CREATE TABLE [quiz_items] ([question] VARCHAR(255), [optionA] VARCHAR(255), [optionB] VARCHAR(255), [optionC] VARCHAR(255), [optionD] VARCHAR(255), [answer] CHARACTER(1))');
  });

  db.close();
  res.send('ok');
});

const channel_name = 'quiz-channel';
const question_timing = 13000; // 10s to show + 2s latency
const question_count = 10;
const top_users_delay = 10000;

const timedQuestion = (row, index) => {
  setTimeout(() => {
    Object.assign(row, { index });

    pusher.trigger(
      channel_name,
      'question-given',
      row
    );

  }, index * question_timing);
}

app.get("/questions", (req, res) => {
  var index = 1;
  db.each('SELECT question, answer, optionA, optionB, optionC, optionD, answer FROM quiz_items ORDER BY random() LIMIT ' + question_count, (err, row) => {
    timedQuestion(row, index);
    index += 1;
  });

  setTimeout(() => {
    console.log('now triggering score...');
    const sorted_users_by_score = users.sort((a, b) => b.score - a.score)
    const top_3_users = sorted_users_by_score.slice(0, 1); // replace 1 with 3

    pusher.trigger(channel_name, 'top-users', {
      users: top_3_users
    });
  }, (question_timing * (question_count + 2)) + top_users_delay);

  res.send('ok');
});

app.post("/increment-score", (req, res) => {
  const { username } = req.body;

  const user_index = users.findIndex(user => user.username == username);
  users[user_index].score += 1;

  res.send('ok');
});

var port = process.env.PORT || 5000;
app.listen(port);