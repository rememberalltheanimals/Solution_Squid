require('dotenv').config(); //read enviroment variables from .env
const { count } = require('console');
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5163;
const { Pool } = require('pg');

//Socket.io variables
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { Socket } = require('dgram');
const io = new Server(server);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async (req, res) => {
    try {
      const client = await pool.connect();

      //SQL Variables
      const testSQL = `SELECT id FROM test;`;
      const testCount = await client.query(testSQL);

      // Server variables that need to be passed to the local js files.
      const args = {
        testCount: testCount ? testCount.rowCount : null,
      };

      //Passes page to browser to display "pages/index".
      //Passes server variables to js file "args".
      res.render('pages/index', args);
    } catch (err) {
      console.error(err);
      res.set({
        'Content-Type': 'application/json',
      });
      res.json({
        error: err,
      });
    }
  })
  .get('/feedback', async(req, res) => {
    try {
      const client = await pool.connect();

      res.render('pages/feedback', args);
    } catch (err) {
      console.error(err);
      res.set({
        'Content-Type': 'application/json',
      });
      res.json({
        error: err,
      });
    }
  })
  .post('/log', async (req, res) => {
    res.set({
      'Content-Type': 'application/json',
    });
    try {
      const client = await pool.connect();
      const id = req.body.id;

      const insertSql = `INSERT INTO test (countNum)
        VALUES ($1);`;

      const insert = await client.query(insertSql, [id]);

      const response = {
        newId: insert ? insert.rows[0] : null,
      };

      res.json(response);

      client.release();
    } catch (err) {
      console.error(err);
      res.json({
        error: err,
      });
    }
  });

//Io functions.
io.on('connection', (socket) => {
  socket.on('Socket established', () => {
    io.sockets.emit('Socket established');
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
