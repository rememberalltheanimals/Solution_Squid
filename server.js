require('dotenv').config(); //read enviroment variables from .env
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5163;
const { Pool } = require('pg');

//login variables
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const saltRounds = 10;
const passport = require('passport');
const initUserPassport = require('./userAuth');

initUserPassport(passport);

function checkUser(req) {
  if (req.isAuthenticated()) {
    return true;
  } else {
    return false;
  }
}

//use for pages that require a person to be logged out. (example: register.ejs and login.ejs)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

//use for pages that require a person to be logged in. (example: message boards that attach a message to a user.)
function isLoggedOut(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  return res.redirect('/login');
}

//Socket.io variables
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { Socket } = require('dgram');
const { initialize } = require('passport');
const { Session } = require('express-session');
const { response } = require('express');
const io = new Server(server);

//Database instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

//Middleware
app
  .use(express.static(path.join(__dirname, 'public')))
  .use('/public', express.static('public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(flash())
  .use(
    session({
      secret: process.env.SECRET_KEY,
      resave: true,
      saveUninitialized: false,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .set('views', path.join(__dirname, 'views'))
  .set('partials', path.join(__dirname, 'partials'))
  .set('view engine', 'ejs');

//used in index.ejs - might be removed in future iteration.
app.post('/log', async (req, res) => {
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

//emailSuccess.ejs
app.get('/emailSuccess', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/emailSuccess', args);
});
app.get('/checklist', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/checklist', args);
});
app.get('/discussion', async (req, res) => {
  try {
    const client = await pool.connect();

    //SQL Variables
    const feedbackSQL = `SELECT post FROM discussion ORDER BY id ASC;`;
    const feedbackCount = await client.query(feedbackSQL);

    // Server variables that need to be passed to the local js files.
    const args = {
      feedbackCount: feedbackCount ? feedbackCount.rows : null,
      user: checkUser(req),
    };

    res.render('pages/discussion', args);
    client.release();
  } catch (err) {
    console.error(err);
    res.set({
      'Content-Type': 'application/json',
    });
    res.json({
      error: err,
    });
  }
});

//fundraise.ejs
app.get('/fundraise', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/fundraise', args);
});

//fortune_cookie.ejs
app.get('/fortune_cookie', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/fortune_cookie', args);
});

//blog.ejs
app.get('/blog', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/blog', args);
});
//resources.ejs
app.get('/resources', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/resources', args);
});

//quizzes.ejs
app.get('/quizzes', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes', args);
});
//dynamic.ejs for Dynamic Planet
app.get('/dynamic', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/dynamic', args);
});
//astronomy.ejs for Astronomy
app.get('/astronomy', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/astronomy', args);
});
//remote.ejs for Remote Sensing
app.get('/remote', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/remote', args);
});
//chemistry-lab.ejs for Chemistry Lab
app.get('/chemistry-lab', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/chemistry-lab', args);
});
//env-chem.ejs for Environmental Chemistry
app.get('/env-chem', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/env-chem', args);
});
//forensics.ejs for Forensics
app.get('/forensics', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/forensics', args);
});
//time.ejs for It's About Time
app.get('/time', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/time', args);
});
//wifi.ejs for Wifi Lab
app.get('/wifi', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/wifi', args);
});
//fermi.ejs for Fermi Questions
app.get('/fermi', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/fermi', args);
});
//horticulture.ejs for Horticulture
app.get('/horticulture', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/horticulture', args);
});
//medicine.ejs for Precision Medicine
app.get('/medicine', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/quizzes/medicine', args);
});

//home.ejs
app.get('/home', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/home', args);
});

//travel.ejs
app.get('/travel', function (req, res) {
  args = {
    user: checkUser(req),
  };
  res.render('pages/travel', args);
});

//registration.ejs
app
  .get('/registration', isLoggedIn, function (req, res) {
    const args = {
      message: '',
      user: checkUser(req),
    };
    res.render('pages/registration', args);
  })
  .post('/registration', async (req, res) => {
    try {
      const client = await pool.connect();

      //pulls user information from the form
      const fName = req.body.fName;
      const lName = req.body.lName;
      const email = req.body.email;
      const emailList = req.body.emailList;
      let signUp;

      //regex validates email address
      const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };

      if (emailList == 'true') {
        signUp = 1;
      } else {
        signUp = 0;
      }

      if (!validateEmail(email)) {
        req.flash(
          'email_in_use',
          'This email is invalid. please enter your email.'
        );
        res.redirect('/registration');
      } else {
        //SQL statements for inserting user and checking if user is already inserted.
        const insertSQL = `INSERT INTO users (userEmails, userfNames, userlNames, userPwords, emailList) VALUES ($1, $2, $3, $4, $5);`;
        const checkSQL = `SELECT * FROM users WHERE userEmails = $1`;

        //if email is registered tell user else insert user
        pool.query(checkSQL, [email], (err, results) => {
          if (results.rowCount > 0) {
            req.flash('email_in_use', 'This email is already registered.');
            res.redirect('/registration');
          } else {
            //generating a salt and hashing password of user prior to inserting info into db.
            bcrypt.genSalt(saltRounds, function (err, salt) {
              bcrypt.hash(req.body.password, salt, async function (err, hash) {
                const insert = await client.query(insertSQL, [
                  email,
                  fName,
                  lName,
                  hash,
                  signUp,
                ]);
                const response = {
                  newId: insert ? insert.rows[0] : null,
                };
                // res.json(response);
                client.release();
              });
            });
            req.flash('registered', 'Registered Succesfully!');
            res.redirect('/login');
          }
        });
      }
      //if something goes wrong bring user back to registration page.
    } catch (err) {
      res.redirect('/registration');
      // res.set({
      //   'Content-Type': 'application/json',
      // });
      console.log(err);
      // res.json({
      //   error: err,
      // });
    }
  });

//login.ejs
app
  .get('/login', isLoggedIn, function (req, res) {
    args = {
      user: checkUser(req),
    };
    res.render('pages/login', args);
  })
  .post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    })
  );

//log users out.
app.get('/logout', (req, res) => {
  args = {
    user: checkUser(req),
  };
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash('registered', 'Logged out.');
  res.redirect('/login');
});

//upcoming.ejs
// app.get('/upcoming', function (req, res) {
//   args = {
//     user: checkUser(req),
//   };
//   res.render('pages/upcoming', args);
// });

//root page - currently home.ejs
app.get('/', async (req, res) => {
  args = {
    user: checkUser(req),
  };
  res.render('pages/home', args);
});

//feedback.ejs
app
  .get('/feedback', async (req, res) => {
    try {
      const client = await pool.connect();

      //SQL Variables
      const feedbackSQL = `SELECT advice FROM feedback ORDER BY id ASC;`;
      const feedbackCount = await client.query(feedbackSQL);

      // Server variables that need to be passed to the local js files.
      const args = {
        feedbackCount: feedbackCount ? feedbackCount.rows : null,
        user: checkUser(req),
      };

      res.render('pages/feedback', args);
      client.release();
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
    res.json({
      error: err,
    });
  })
  .post('/feedlog', async (req, res) => {
    res.set({
      'Content-Type': 'application/json',
    });
    try {
      const client = await pool.connect();
      const id = req.body.id;
      const values = 'test';
      const insertfeedSql = `INSERT INTO feedback (advice)
        VALUES ($1);`;

      const insert = await client.query(insertfeedSql, [id]);

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

//emailsignup.ejs - will be replaced with new functionallity in register.ejs eventually
app
  // .get('/emailSignup', function (req, res) {
  //   args = {
  //     user: checkUser(req),
  //   };
  //   res.render('pages/emailSignup', args);
  // })
  .post('/discussion', async (req, res) => {
    res.set({
      'Content-Type': 'application/json',
    });
    try {
      const client = await pool.connect();
      const id = req.body.id;
      const values = 'test';
      const insertfeedSql = `INSERT INTO discussion (post)
        VALUES ($1);`;

      const insert = await client.query(insertfeedSql, [id]);

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
  })
  .post('/emailSignup', async (req, res) => {
    res.set({
      'Content-Type': 'application/json',
    });
    try {
      const client = await pool.connect();
      const emailValue = req.body.userEmail;
      const nameValue = req.body.userName;
      const insertSql = `INSERT INTO userEmails (userEmails, userNames)
      VALUES ($1, $2);`;
      const insert = await client.query(insertSql, [emailValue, nameValue]);
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
