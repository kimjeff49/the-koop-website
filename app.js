const express = require('express');
const next = require('next');
const helmet = require('helmet');
const session = require('express-session');
const bodyParser = require('body-parser');
const cryptoRandomString = require('crypto-random-string');

const { emailSender } = require('./util/email');

const dev = process.env.NODE_ENV !== 'production';
const server = next({ dev });
const handle = server.getRequestHandler();

server
  .prepare()
  .then(() => {
    const app = express();

    const port = process.env.PORT || 3000;

    const session_secret = cryptoRandomString({ length: 10, type: 'base64' });

    if (dev) {
      const morgan = require('morgan');
      app.use(morgan('common'));
    }

    app.use(bodyParser.json());
    app.use(
      session({
        secret: session_secret,
        resave: false,
        saveUninitialized: true,
      })
    );
    app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    app.get('/api/menu/chicken/items', (req, res) => {
      res.send([
        {
          name: 'soy garlic',
          type: 'chicken',
          src: '/static/images/soygarlic-1.jpg',
        },
        {
          name: 'spicy soy garlic',
          type: 'chicken',
          src: '/static/images/soygarlic-5.jpg',
        },
        {
          name: 'extra spicy',
          type: 'chicken',
          src: '/static/images/sweet_spicy-2.jpg',
        },
        {
          name: 'sweet & spicy',
          type: 'chicken',
          src: '/static/images/sweet_spicy-3.jpg',
        },
        {
          name: 'honey garlic',
          type: 'chicken',
          src: '/static/images/honeygarlic-4.jpg',
        },
        {
          name: 'mild',
          type: 'chicken',
          src: '/static/images/mild-5.jpg',
        },
      ]);
    });

    app.get('/api/menu/side/items', (req, res) => {
      res.send([
        {
          name: 'white rice',
          type: 'side',
          src: '',
        },
        {
          name: 'pickled radish',
          type: 'side',
          src: '',
        },
      ]);
    });

    app.get('/api/menu/chicken/prices', (req, res) => {
      res.send([
        {
          type: 'whole',
          size: 'small',
          price: 9.95,
          amount: '7-8',
        },
        {
          type: 'whole',
          size: 'large',
          price: 18.95,
          amount: '14-16',
        },
        {
          type: 'wings',
          size: 'small',
          price: 11.95,
          amount: '8',
        },
        {
          type: 'wings',
          size: 'large',
          price: 20.95,
          amount: '16',
        },
        {
          type: 'drumsticks',
          size: 'small',
          price: 11.95,
          amount: '5',
        },
        {
          type: 'drumsticks',
          size: 'large',
          price: 20.95,
          amount: '10',
        },
        {
          type: 'boneless',
          size: 'small',
          price: 9.95,
          amount: '450g',
        },
        {
          type: 'boneless',
          size: 'large',
          price: 18.95,
          amount: '900g',
        },
      ]);
    });

    app.post('/api/email', (req, res) => {
      const email = req.body.value;
      emailSender(email);
      res.sendStatus(200);
    });

    app.get('*', (req, res) => {
      return handle(req, res);
    });

    app.listen(port, () => {
      console.log(`listening on port ${port}!`);
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
