require('dotenv').config()
const path = require('path');

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONECTSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        () => {
            app.emit('pronto');
            console.log('Conexao estabelecida!');
        }
    )
    .catch(e => console.error('Erro ao conectar ao banco de dados:', e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');

const routes = require('./routes');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(helmet());

const sessionOptions = session({
    secret: 'ddasdawedsadwarfsaejikoasedjiklosedjii',
    store: MongoStore.create({ mongoUrl: process.env.CONECTSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(sessionOptions);
app.use(flash());

app.use(csrf());

app.use(middlewareGlobal);
app.use(csrfMiddleware);
app.use(checkCsrfError);

app.use(routes);






app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor iniciado. Porta:3000');
    });
})

