if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const studentRouter = require('./routes/studentRoute');
const userRouter = require('./routes/userRoute');
const inchargeRouter = require('./routes/inchargeRoute');
const scoreRouter = require('./routes/scoreRoute');

// Instantiate express app
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static assets
app.use(express.static(path.join(__dirname, '/public')));

// Views and View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));

// Body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Method-override middleware
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// express-session middleware
const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// connect-flash middleware
app.use(flash());

// flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Cookie parser middleware
app.use(cookieParser());

// Routers
app.get('/', (req, res, next) => {
  res.redirect('/users/login');
});

app.use('/students', studentRouter);
app.use('/users', userRouter);
app.use('/incharges', inchargeRouter);
app.use('/scores', scoreRouter);

// Export app to server
module.exports = app;
